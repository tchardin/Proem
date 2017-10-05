
from flask import Flask, request
from flask_restful import Resource, Api
from sqlalchemy import create_engine
from json import dumps

#Create a engine for connecting to SQLite3.
#Assuming bitfinexBTCUSD.db is in your app root folder

e = create_engine('sqlite:///bitfinexBTCUSD.db')

app = Flask(__name__)
api = Api(app)

class All_Data(Resource):
    def get(self):
        #Connect to databse
        conn = e.connect()
        #Perform query and return JSON data
        query = conn.execute("select * from bitfinexBTCUSD")
        return {'data': [dict(zip(tuple (query.keys()) ,i)) for i in query.cursor]}

class Data_Intervals(Resource):
    def get(self, date_from, date_to):
        conn = e.connect()
        query = conn.execute("select * from bitfinexBTCUSD where Date between '%s' and '%s'"%(date_from,date_to))
        #Query the result and get cursor.Dumping that data to a JSON is looked by extension
        result = {'data': [dict(zip(tuple (query.keys()) ,i)) for i in query.cursor]}
        return result
        #We can have PUT,DELETE,POST here. But in our API GET implementation is sufficient

api.add_resource(Data_Intervals, '/data/<string:date_from>/<string:date_to>')
api.add_resource(All_Data, '/all')


if __name__ == '__main__':
     app.run()
