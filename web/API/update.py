##Task automation libraries
from __future__ import absolute_import
from celery import Celery
from celery.task import periodic_task, task
from celery.schedules import crontab
from sqlalchemy import create_engine
from ast import literal_eval

from datetime import datetime
import requests


#Create a engine for connecting to SQLite3.
#Assuming bitfinex.db is in your app root folder
e = create_engine('sqlite:///bitfinex.db')

supported_currencies = ["BTC","ETH", "LTC"]

app = Celery()
app.conf.timezone = 'Europe/London'

app.autodiscover_tasks()

app.conf.beat_schedule = {
    # Executes 3 minutes before midnight
    'update_history': {
        'task': 'tasks.update',
        'schedule': crontab(minute=57, hour=11),
        'args': (),
    },

    # Executes every 10 minutes
    'update_price_cache': {
        'task': 'tasks.update_regularly',
        'schedule': crontab(minute='*/1'),
        'args': (),
    },
}


@app.task(name='tasks.update')
def update():
    conn = e.connect()
    bit_tickers = ['t{0}USD'.format(currency) for currency in supported_currencies]
    r = literal_eval(requests.get("https://api.bitfinex.com/v2/tickers?symbols=" + ",".join(bit_tickers)).content)
    for idx,coin_data in enumerate(r):
        data = [str(datetime.now().date())] + [coin_data[i] for i in [-2,-1,-4,1,3,-3]] + [supported_currencies[idx]]
        data.insert(3,(data[1]+data[2])/2.0)
        query = conn.execute("select 1 from %s where date = '%s'"%(supported_currencies[idx],data[0]))
        if query.cursor.fetchone() is None:
            try:
                conn.execute(
                "insert into %s values"%supported_currencies[idx]+"('%s',"%data[0]
                + ",".join([str(d) for d in data[1:-1]]) + ",'%s')"%data[-1]
                )
            except:
                print("Failed to update database")
        else:
            pass

@app.task(name='tasks.update_regularly')
def update_regularly():
    conn = e.connect()
    bit_tickers = ['t{0}USD'.format(currency) for currency in supported_currencies]
    r = literal_eval(requests.get("https://api.bitfinex.com/v2/tickers?symbols=" + ",".join(bit_tickers)).content)
    for idx,coin_data in enumerate(r):
        data = [str(datetime.now())] + [coin_data[i] for i in [-2,-1,-4,1,3,-3]] + [supported_currencies[idx]]
        data.insert(3,(data[1]+data[2])/2.0)
        try:
            conn.execute("create table if not exists %s_hourly(Date text,"%(supported_currencies[idx])
            +"High text,"
            +"Low text,"
            + "Mid text,"
            + "Last text,"
            + "Bid text,"
            + "Ask text,"
            + "Volume text,"
            + "Coin text)")
            conn.execute(
            "insert into %s_hourly values"%(supported_currencies[idx])
            + "('%s',"%data[0] + ",".join([str(d) for d in data[1:-1]]) + ",'%s')"%data[-1]
            )
            conn.execute("delete from %s_hourly where Date <= date('now','-14 day')"%supported_currencies[idx])
        except:
            print("Failed to update cache")
