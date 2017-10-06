
#API related libraries
from flask import Flask, request
from flask_restful import Resource, Api
from sqlalchemy import create_engine
from json import dumps
from datetime import datetime
from ast import literal_eval
import requests

app = Flask(__name__)
api = Api(app)

supported_currencies = ["BTC","ETH", "LTC"]

e = create_engine('sqlite:///bitfinex.db')



class All_Data(Resource):
    def get(self, coin):
        #Connect to database
        conn = e.connect()
        #Perform query and return JSON data
        query = conn.execute("select * from %s order by date asc"%coin)
        return {'data': [dict(zip(tuple (query.keys()) ,i)) for i in query.cursor]}

class Current_Data(Resource):
    def get(self, coin):
        conn = e.connect()
        bfx_coin = 't{0}USD'.format(coin)
        #May seem wasteful but will keep the same names across applications
        query = conn.execute("select * from %s"%coin)
        r = literal_eval(requests.get("https://api.bitfinex.com/v2/ticker/%s"%bfx_coin).content)
        data = [str(datetime.now())] + [float(r[i]) for i in [-2,-1,-4,0,2,-3]] + [coin]
        data.insert(3,(data[1]+data[2])/2.0)
        return {'data': [dict(zip(tuple (query.keys()) ,data))]}

class Data_Intervals(Resource):
    def get(self, coin, date_from, date_to):
        conn = e.connect()
        query = conn.execute("select * from %s where Date between '%s' and '%s' order by date asc"%(coin, date_from, date_to))
        #Query the result and get cursor.Dumping that data to a JSON is looked by extension
        result = {'data': [dict(zip(tuple (query.keys()) ,i)) for i in query.cursor]}
        return result
        #We can have PUT,DELETE,POST here. But in our API GET implementation is sufficient


api.add_resource(All_Data, '/<string:coin>')
api.add_resource(Current_Data, '/now/<string:coin>')
api.add_resource(Data_Intervals, '/<string:coin>/<string:date_from>/<string:date_to>')





if __name__ == '__main__':
     app.run()
