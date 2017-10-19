

#API related libraries
from flask import Flask, request, Response
from flask_restful import Resource, Api
from sqlalchemy import create_engine
from json import dumps
from datetime import datetime
from ast import literal_eval
import requests
import psycopg2
import config
import quandl

application = Flask(__name__)
# application.config["DEBUG"] = True
api = Api(application)

supported_currencies = ["BTC","ETH", "LTC", "BCH", "ETC","ZEC","XMR"]
supported_currencies_writted = ["bitcoin","ethereum", "litecoin","bitcoin-cash", "ethereum-classic","zcash","dash","monero"]
supported_fiat = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD',  'CNY', 'NZD', 'ZAR']


global_keys = ["Date","High","Low","Mid","Last","Bid","Ask","Volume"]

convert_symbols = dict()
convert_symbols['DASH'] = "dash"
for idx,currency in enumerate(supported_currencies):
    convert_symbols[currency] = supported_currencies_writted[idx]


def connect_to_database(config) :
    try:
        conn=psycopg2.connect(dbname= 'proemdbdev', host= config.database_host,
        port= '5432', user= 'proem_admin', password= config.RDS_password)
    except ValueError as valerr:
        print("Unable to connect to database: " + valerr)
    return conn

def make_request(url, cursor):
    try:
        cursor.execute(url)
    except ValueError as valerr:
        print("Failed to extract data: " + str(valerr))


#### EXTRACTS DATA FROM PROEM MAINTAINED DATABASE ######################################
class All_Data(Resource):
    def get(self, coin):
        #Connect to database
        date_to = request.args.get('date_to')
        print(date_to)
        date_from = request.args.get('date_from')
        fiat = request.args.get('fiat')
        if fiat is None:
            fiat = 'USD'
        conn = connect_to_database(config)
        cursor = conn.cursor()
        #Perform query and return JSON data
        if (date_to is None and date_from is not None):
            make_request("select * from %s%s where Date >= '%s' order by date asc"%(coin,fiat, date_from), cursor)
        elif(date_to is None and date_from is None):
            make_request("select * from %s%s order by date asc"%(coin,fiat), cursor)
        else:
            make_request("select * from %s%s where Date between '%s' and '%s' order by date asc"%(coin,fiat, date_from, date_to), cursor)
        #Query the result and get cursor.Dumping that data to a JSON is looked by extension
        keys = [desc[0] for desc in cursor.description]
        resp = Response(dumps([dict(zip(tuple(keys),i)) for i in cursor]))
        conn.close()
        #add access control to API.
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp


#### EXTRACTS DATA FROM QUANDL MAINTAINED DATABASE ######################################

class Quandl_Data(Resource):
    def get(self, coin):
        #Connect to database
        try:
            df = quandl.get("BITFINEX/%sUSD"%coin, authtoken="25hmrVodDAz9wn53zGbv")
        except ValueError as valerr:
            print("Failed to extract data from quandl: " + str(valerr))

        resp = Response(dumps([dict(zip(list(df),i)) for i in df.values]))
        #add access control to API.
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class Quandl_Intervals(Resource):
    def get(self, coin, date_from, date_to):

        try:
            df = quandl.get("BITFINEX/%sUSD"%coin, authtoken="25hmrVodDAz9wn53zGbv")
            mask = (df['Date'] > date_from) & (df['Date'] <= date_to)
            df = df.loc[mask]
        except ValueError as valerr:
            print("Failed to extract data from quandl: " + str(valerr))
        resp = Response(dumps([dict(zip(list(df) ,i)) for i in df.values]))
        conn.close()
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

#### GETS CURRENT DATA AND METRICS  ######################################

class Data_Metrics(Resource):
    def get(self, coin):
        fiat = request.args.get('fiat')
        if fiat is None:
            fiat = 'USD'
        data = []
        coin = convert_symbols[coin]
        try:
            r = literal_eval(requests.get("https://api.coinmarketcap.com/v1/ticker/%s/?convert=%s"%(coin,fiat)).content)
        except ValueError as valerr:
            print("Failed to get metrics data from coinmarketcap: " + str(valerr))
            return Response(dumps("currency not supported"))
        print(r)
        r_formatted = [{
        'market_cap': r[0]['market_cap_'+fiat.lower()],
        'price': r[0]['price_'+fiat.lower()],
        'last_updated': r[0]['last_updated'],
        'name': r[0]['name'],
        '24h_volume': r[0]['24h_volume_'+fiat.lower()],
        'percent_change_7d': r[0]['percent_change_7d'],
        'symbol': r[0]['symbol'],
        'rank': r[0]['rank'],
        'percent_change_1h': r[0]['percent_change_1h'],
        'total_supply': r[0]['total_supply'],
        'available_supply': r[0]['available_supply'],
        'percent_change_24h': r[0]['percent_change_24h'],
        'id': r[0]['id'],
        }]
        resp = Response(dumps(r_formatted))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class Supported_Currency(Resource):
    def get(self):
        resp = Response(dumps({'crypto': supported_currencies, 'fiat': supported_fiat}))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class Current_Data(Resource):
    def get(self, coin):
        fiat = request.args.get('fiat')
        if fiat is None:
            fiat = 'USD'
        bfx_coin = 't{0}USD'.format(coin)
        #May seem wasteful but will keep the same names across applications
        try:
            rates = literal_eval(requests.get("http://api.fixer.io/latest?base=USD").content)
            r = literal_eval(requests.get("https://api.bitfinex.com/v2/ticker/%s"%bfx_coin).content)
        except ValueError as valerr:
            print("Failed to get current data from bitfinex: " + str(valerr))
        if (fiat != 'USD'):
            data = [str(datetime.now())] + [float(r[i])*rates['rates'][fiat] for i in [-2,-1,-4,0,2,-3]]
        else:
            data = [str(datetime.now())] + [float(r[i]) for i in [-2,-1,-4,0,2,-3]]
        data.insert(3,(data[1]+data[2])/2.0)
        resp = Response(dumps([dict(zip(tuple(global_keys) ,data))]))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class Data_Candles(Resource):
    def get(self, coin):
        fiat = request.args.get('fiat')
        interval = request.args.get('interval')
        if fiat is None:
            fiat = 'USD'
        if interval is None:
            interval = '1M'
        data = []
        bfx_coin = 't{0}USD'.format(coin)
        try:
            rates = literal_eval(requests.get("http://api.fixer.io/latest?base=USD").content)
            r = literal_eval(requests.get("https://api.bitfinex.com/v2/candles/trade:%s:%s/hist?limit=1000"%(interval,bfx_coin)).content)
        except ValueError as valerr:
            print("Failed to get candles data from bitfinex: " + str(valerr))
        for point in r:
            if (fiat != 'USD'):
                data.append([str(datetime.fromtimestamp(point[0]//1000.0))] + [float(point[i])*rates['rates'][fiat] for i in range(1,len(point))])
            else:
                data.append([str(datetime.fromtimestamp(point[0]//1000.0))] + [float(point[i]) for i in range(1,len(point))])
        print data[0]
        resp = Response(dumps([dict(zip(tuple (["Date", "Open", "Close", "High", "Low", "Volume"]) ,d)) for d in data]))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

        #We can have PUT,DELETE,POST here. But in our API GET implementation is sufficient



### global data
api.add_resource(All_Data, '/<string:coin>')
# api.add_resource(Data_Intervals, '/<string:coin>')
### supported currencies
api.add_resource(Supported_Currency, '/supported')
api.add_resource(Data_Metrics, '/metrics/<string:coin>')
api.add_resource(Current_Data, '/now/<string:coin>')
api.add_resource(Data_Candles, '/candles/<string:coin>')

if __name__ == '__main__':
     application.run()
