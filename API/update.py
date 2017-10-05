##Task automation libraries
from celery import Celery
from celery.task import periodic_task
from celery.schedules import crontab
from sqlalchemy import create_engine
import requests

#Create a engine for connecting to SQLite3.
#Assuming bitfinex.db is in your app root folder
e = create_engine('sqlite:///bitfinex.db')

supported_currencies = ["BTC","ETH", "LTC"]

app = Celery()
app.conf.timezone = 'Europe/London'

app.conf.beat_schedule = {
    # Executes every Monday morning at 7:30 a.m.
    'update_databases': {
        'task': 'tasks.update',
        'schedule': crontab(minute='*/1'),
        'args': (16, 16),
    },
}

@app.task
def update():
    bit_tickers = ['t{0}USD'.format(currency) for currency in supported_currencies]
    r = requests.get("https://api.bitfinex.com/v2/tickers?symbols=" + ",".join(bit_tickers))
    print r
