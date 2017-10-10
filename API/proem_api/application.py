

#API related libraries
from flask import Flask, request, Response
from flask_restful import Resource, Api
from sqlalchemy import create_engine
from json import dumps
from datetime import datetime
from ast import literal_eval
import requests

application = Flask(__name__)
# application.config["DEBUG"] = True
api = Api(application)

supported_currencies = ["BTC","ETH", "LTC"]

e = create_engine('sqlite:///bitfinex.db')


class All_Data(Resource):
    def get(self, coin):
        #Connect to database
        conn = e.connect()
        #Perform query and return JSON data
        try:
            query = conn.execute("select * from %s order by date asc"%coin)
        except ValueError as valerr:
            print("Failed to extract all data: " + str(valerr))
        #Query the result and get cursor.Dumping that data to a JSON is looked by extension
        resp = Response(dumps([dict(zip(tuple (query.keys()) ,i)) for i in query.cursor]))
        #add access control to API.
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class Current_Data(Resource):
    def get(self, coin):
        conn = e.connect()
        bfx_coin = 't{0}USD'.format(coin)
        #May seem wasteful but will keep the same names across applications
        try:
            query = conn.execute("select * from %s"%coin)
            r = literal_eval(requests.get("https://api.bitfinex.com/v2/ticker/%s"%bfx_coin).content)
        except ValueError as valerr:
            print("Failed to get current data from bitfinex: " + str(valerr))
        data = [str(datetime.now())] + [float(r[i]) for i in [-2,-1,-4,0,2,-3]] + [coin]
        data.insert(3,(data[1]+data[2])/2.0)
        resp = Response(dumps([dict(zip(tuple (query.keys()) ,data))]))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp

class Data_Candles(Resource):
    def get(self, coin, interval):
        data = []
        bfx_coin = 't{0}USD'.format(coin)
        try:
            r = literal_eval(requests.get("https://api.bitfinex.com/v2/candles/trade:%s:%s/hist?limit=1000"%(interval,bfx_coin)).content)
        except ValueError as valerr:
            print("Failed to get candles data from bitfinex: " + str(valerr))
        for point in r:
            data.append([[str(datetime.fromtimestamp(point[0]//1000.0))] + [float(point[i]) for i in range(1,len(point))] + [coin]])
        resp = Response(dumps([dict(zip(tuple (["Date", "Open", "Close", "High", "Low", "Volume"]) ,d)) for d in data]))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp
        #We can have PUT,DELETE,POST here. But in our API GET implementation is sufficient

class Data_Intervals(Resource):
    def get(self, coin, date_from, date_to):
        conn = e.connect()
        try:
            query = conn.execute("select * from %s where Date between '%s' and '%s' order by date asc"%(coin, date_from, date_to))
        except ValueError as valerr:
            print("Failed to extract historical data in intervals: " + str(valerr))
        resp = Response(dumps([dict(zip(tuple (query.keys()) ,i)) for i in query.cursor]))
        resp.headers['Access-Control-Allow-Origin'] = '*'
        return resp
        #We can have PUT,DELETE,POST here. But in our API GET implementation is sufficient


api.add_resource(All_Data, '/<string:coin>')
api.add_resource(Data_Intervals, '/<string:coin>/<string:date_from>/<string:date_to>')
api.add_resource(Current_Data, '/now/<string:coin>')
api.add_resource(Data_Candles, '/candles/<string:coin>/<string:interval>')








if __name__ == '__main__':
     application.run()
