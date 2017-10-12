from __future__ import absolute_import

##Task automation libraries
from celery import Celery, current_app
from celery.task import periodic_task, task
from celery.bin import worker
import celery.signals
from celery.schedules import crontab

##Other libs
from ast import literal_eval
from datetime import datetime
import requests
import config

supported_currencies = ["BTC","ETH", "LTC"]

#Create a engine for connecting to SQLite3.
#Assuming bitfinex.db is in your app root folder
def connect_to_database(config) :
    try:
        conn=psycopg2.connect(dbname= 'proemdbdev', host= config.database_host,
        port= '5432', user= 'proem_admin', password= config.RDS_password)
    except ValueError as valerr:
        print("Unable to connect to database: " + valerr)
    return conn

application = Celery()
application.conf.timezone = 'Europe/London'

application.autodiscover_tasks()

application.conf.beat_schedule = {
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

@application.task(name='tasks.update')
def update():
    conn = connect_to_database(config)
    cursor = conn.cursor()
    bit_tickers = ['t{0}USD'.format(currency) for currency in supported_currencies]
    r = literal_eval(requests.get("https://api.bitfinex.com/v2/tickers?symbols=" + ",".join(bit_tickers)).content)
    for idx,coin_data in enumerate(r):
        date = str(datetime.now().date())
        cursor.execute("select 1 from %s where date = '%s'"%(supported_currencies[idx],date))
        if cursor.fetchone() is None:
            print("Updating database......")
            data = [date] + [coin_data[i] for i in [-2,-1,-4,1,3,-3]]
            data.insert(3,(data[1]+data[2])/2.0)
            try:
                cursor.execute(
                "insert into %s values"%supported_currencies[idx]+"('%s',"%data[0]
                + ",".join([str(d) for d in data[1:]]) + ")"
                )
            except:
                print("Failed to update database")
        else:
            pass
    conn.commit()
    conn.close()

@application.task(name='tasks.update_regularly')
def update_regularly():
    conn = connect_to_database(config)
    cursor = conn.cursor()
    bit_tickers = ['t{0}USD'.format(currency) for currency in supported_currencies]
    r = literal_eval(requests.get("https://api.bitfinex.com/v2/tickers?symbols=" + ",".join(bit_tickers)).content)
    for idx,coin_data in enumerate(r):
        data = [str(datetime.now())] + [coin_data[i] for i in [-2,-1,-4,1,3,-3]]
        data.insert(3,(data[1]+data[2])/2.0)
        try:
            cursor.execute("create table if not exists %s_hourly(Date text,"%(supported_currencies[idx])
            +"High text,"
            +"Low text,"
            + "Mid text,"
            + "Last text,"
            + "Bid text,"
            + "Ask text,"
            + "Volume text)")
            cursor.execute(
            "insert into %s_hourly values"%(supported_currencies[idx])
            + "('%s',"%data[0] + ",".join([str(d) for d in data[1:]]) + ")"
            )
            cursor.execute("delete from %s_hourly where Date <= date('now','-14 day')"%supported_currencies[idx])
        except:
            print("Failed to update cache")
    conn.commit()
    conn.close()


if __name__ == '__main__':
    application.start(argv=['update', 'worker', '-B', '-l', 'info'])
