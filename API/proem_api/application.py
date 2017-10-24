

#API related libraries
from flask import Flask, request, Response
from flask_restful import Resource, Api
from sqlalchemy import create_engine
from json import dumps
from datetime import datetime, timedelta
from ast import literal_eval
import requests
import psycopg2
import config
import quandl
from dateutil.relativedelta import relativedelta

application = Flask(__name__)
# application.config["DEBUG"] = True
api = Api(application)

supported_currencies = ["BTC","ETH", "LTC", "BCH", "ETC","ZEC","XMR"]
supported_fiat = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD',  'CNY', 'NZD', 'ZAR']
supported_currencies_writted = ["bitcoin","ethereum", "litecoin","bitcoin-cash", "ethereum-classic","zcash","dash","monero"]

exchanges = ['BITFINEX','GDAX', 'KRAKEN']

convert_symbols = dict()
convert_symbols['DASH'] = "dash"
for idx,currency in enumerate(supported_currencies):
    convert_symbols[currency] = supported_currencies_writted[idx]

supported_currencies_exchange = dict()
supported_currencies_exchange['BITFINEX'] = supported_currencies
supported_currencies_exchange['GDAX'] = supported_currencies[0:3]
supported_currencies_exchange['KRAKEN'] = supported_currencies[1:]


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

def roundTimeSeconds(dt=None, roundTo=60):
   if dt == None : dt = datetime.now()
   seconds = (dt.replace(tzinfo=None) - dt.min).seconds
   rounding = seconds// roundTo * roundTo
   return dt + timedelta(0,rounding-seconds,-dt.microsecond)

def convert_interval_KRAKEN(interval):
    if interval == '1m':
        return '1'
        granularity = 60
    elif interval == '5m':
        return '5'
        granularity = 5*60
    elif interval == '10m':
        return '15'
        granularity = 10*60
    elif interval == '30m':
        return '30'
    elif interval == '1h':
        return '60'
    elif interval == '3h':
        return '240'
    elif interval == '6h':
        return '240'
    elif interval == '12h':
        return '240'
    elif interval == '1D':
        return '1440'
    elif interval == '7D':
        return '10080'
    elif interval == '14D':
        return '21600'
    elif interval == '1M':
        return '21600'

def convert_interval_GDAX(interval, granularity):
    end = datetime.now()
    if interval == '1m':
        end = roundTimeSeconds(dt=end,roundTo=60)
        start = end - timedelta(minutes=granularity*1)
        granularity = 60
    elif interval == '5m':
        end = roundTimeSeconds(dt=end,roundTo=5*60)
        start = end - timedelta(minutes=granularity*5)
        granularity = 5*60
    elif interval == '10m':
        end = roundTimeSeconds(dt=end,roundTo=10*60)
        start = end - timedelta(minutes=granularity*10)
        granularity = 10*60
    elif interval == '30m':
        end = roundTimeSeconds(dt=end,roundTo=30*60)
        start = end - timedelta(minutes=granularity*30)
        granularity = 30*60
    elif interval == '1h':
        end = roundTimeSeconds(dt=end,roundTo=60*60)
        start = end - timedelta(minutes=granularity*60)
        granularity = 60*60
    elif interval == '3h':
        end = roundTimeSeconds(dt=end,roundTo=3*60*60)
        start = end - timedelta(minutes=granularity*3*60)
        granularity = 3*60*60
    elif interval == '6h':
        end = roundTimeSeconds(dt=end,roundTo=6*60*60)
        start = end - timedelta(minutes=granularity*6*60)
        granularity = 6*60*60
    elif interval == '12h':
        end = roundTimeSeconds(dt=end,roundTo=12*60*60)
        start = end - timedelta(minutes=granularity*12*60)
        granularity = 12*60*60
    elif interval == '1D':
        end = end.replace(hour = 0, second = 0, microsecond = 0)
        start = end - timedelta(days=granularity)
        granularity = 24*60*60
    elif interval == '7D':
        end = end.replace(hour = 0, second = 0, microsecond = 0)-timedelta(days=1)
        start = end - timedelta(days=granularity*7)
        granularity = 7*24*60*60
    elif interval == '14D':
        end = end.replace(hour = 0, second = 0, microsecond = 0)-timedelta(days=1)
        start = end - timedelta(days=granularity*14)
        granularity = 14*24*60*60
    elif interval == '1M':
        end = end.replace(day = 1, hour = 0, second = 0, microsecond = 0)
        start = end - relativedelta(months=200)
        granularity = 30*24*60*60
    return start.isoformat(), end.isoformat(), granularity

def get_exchange_rates(fiat):
    if (fiat != 'USD'):
        rates = literal_eval(requests.get("http://api.fixer.io/latest?base=USD").content)
    else:
        rates = {'rates': {fiat: 1}}
    return rates

def ticker_url(market, coin):
    if market == 'BITFINEX':
        bfx_coin = 't{0}USD'.format(coin)
        r = literal_eval(requests.get("https://api.bitfinex.com/v2/ticker/%s"%bfx_coin).content)
    elif market == 'GDAX':
        gdx_coin = '{0}-USD'.format(coin)
        r = literal_eval(requests.get('https://api.gdax.com/products/%s/ticker'%gdx_coin).content)
    elif market == 'KRAKEN':
        krk_coin = '{0}USD'.format(coin)
        r = literal_eval(requests.get('https://api.kraken.com/0/public/Ticker?pair=%s'%krk_coin).content)
    return r

def ticker_data(coin, rates, fiat, responses):
    ticker_keys = ["Date","High","Low","Mid","Last","Bid","Ask","Volume"]
    resp_dict = dict()
    for resp in responses:
        market = resp[0]
        r = resp[1]
        print r
        if market == 'BITFINEX':
            data = [str(datetime.now())] + [float(r[i])*rates['rates'][fiat] for i in [-2,-1,-4,0,2,-3]]
            data.insert(3,(data[1]+data[2])/2.0)
        elif market == 'GDAX':
            gdx_coin = '{0}-USD'.format(coin)
            r2 = literal_eval(requests.get('https://api.gdax.com/products/%s/stats'%gdx_coin).content)
            data = [str(datetime.now())] + [float(r2[i]) for i in ['high','low']] + [float(r[i]) for i in ['price','bid','ask','volume']]
            data.insert(3,(data[1]+data[2])/2.0)
        elif market == 'KRAKEN':
            data = [str(datetime.now())] + [float(r['result']['X'+coin+'ZUSD'][i][0])*rates['rates'][fiat] for i in ['h','l','c','b','a','v']]
            data.insert(3,(data[1]+data[2])/2.0)
        resp_dict[market] = [dict(zip(tuple(ticker_keys), data))]
    resp = Response(dumps(resp_dict))
    return resp

def candles_url(market,coin, interval):
    if market == 'BITFINEX':
        bfx_coin = 't{0}USD'.format(coin)
        r = literal_eval(requests.get("https://api.bitfinex.com/v2/candles/trade:%s:%s/hist?limit=200"%(interval,bfx_coin)).content)
    elif market == 'GDAX':
        gdx_coin = '{0}-USD'.format(coin)
        start, end, granularity = convert_interval_GDAX(interval,200)
        r = literal_eval(requests.get('https://api.gdax.com/products/%s/candles?start=%s&end=%s&granularity=%s'%(gdx_coin,str(start),str(end),str(granularity))).content)
        # print('https://api.gdax.com/products/%s/candles?start=%s&end=%s&granularity=%s'%(gdx_coin,str(start),str(end),str(granularity)))
    elif market == 'KRAKEN':
        krk_coin = '{0}USD'.format(coin)
        interval = convert_interval_KRAKEN(interval)
        r = literal_eval(requests.get('https://api.kraken.com/0/public/OHLC?pair=%s&interval=%s'%(krk_coin,interval)).content)
    return r

def candles_data(market, coin, rates, fiat, r):
    candles_keys = ["Date", "Open", "Close", "High", "Low", "Volume"]
    data = []
    if market == 'BITFINEX':
        for point in r:
            data.append([str(datetime.fromtimestamp(point[0]//1000.0))] + [float(point[i])*rates['rates'][fiat] for i in range(1,len(point))])
    elif market == 'GDAX':
        for point in r:
            data.append([str(datetime.fromtimestamp(int(point[0])))] + [float(point[i])*rates['rates'][fiat] for i in [3,4,2,1,5]])
    elif market == 'KRAKEN':
        for point in r['result'][coin+fiat]:
            data.append([str(datetime.now())] + [float(point[i])*rates['rates'][fiat] for i in [1,4,2,3,6]])
    resp = Response(dumps([dict(zip(tuple(candles_keys),d)) for d in data]))
    return resp

def format_metrics(r,fiat):
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
    return r_formatted



#### EXTRACTS DATA FROM PROEM MAINTAINED DATABASE ######################################
class All_Data(Resource):
    def get(self, coin):
        #Connect to database
        date_to = request.args.get('date_to')
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
        r_formatted = format_metrics(r,fiat)
        resp = Response(dumps(r_formatted))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class Supported_Currency(Resource):
    def get(self):
        market = request.args.get('market')
        if market is None:
            market = 'BITFINEX'
        resp = Response(dumps({'crypto': supported_currencies_exchange[market], 'fiat': supported_fiat, 'exchanges': exchanges}))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class Current_Data(Resource):
    def get(self, coin):
        fiat = request.args.get('fiat')
        if fiat is None:
            fiat = 'USD'
        try:
            r = []
            rates = get_exchange_rates(fiat)
            for exchange in exchanges:
                if coin in supported_currencies_exchange[exchange]:
                    r.append((exchange, ticker_url(exchange, coin)))
        except ValueError as valerr:
            print("Failed to get current data %s: "%market + str(valerr))
        resp = ticker_data(coin, rates, fiat, r)
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class Data_Candles(Resource):
    def get(self, coin):
        fiat = request.args.get('fiat')
        market = request.args.get('market')
        interval = request.args.get('interval')
        if fiat is None:
            fiat = 'USD'
        if market is None:
            market = 'BITFINEX'
        if interval is None:
            interval = '1M'
        data = []
        try:
            rates = get_exchange_rates(fiat)
            r = candles_url(market,coin, interval)
        except ValueError as valerr:
            print("Failed to get candles data: " + str(valerr))
        resp = candles_data(market, coin, rates, fiat, r)
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
