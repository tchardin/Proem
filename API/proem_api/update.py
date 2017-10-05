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
    # Executes every Monday morning at 7:30 a.m.
    'update_databases': {
        'task': 'tasks.update',
        'schedule': crontab(minute=57, hour=11),
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
                conn.execute("insert into %s values"%supported_currencies[idx]+"('%s',"%data[0] + ",".join([str(d) for d in data[1:-1]]) + ",'%s')"%data[-1])
            except:
                print("Failed to update database")
        else:
            pass
