import psycopg2
import config
import numpy as np
from ast import literal_eval
import requests
import pandas
from time import sleep
import StringIO


supported_currencies = ["BTC","ETH","LTC", "BCH", "ETC","ZEC","XMR","XRP","DASH"]
supported_fiat = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD',  'CNY', 'NZD', 'ZAR']


try:
    conn=psycopg2.connect(dbname= 'proemdbdev', host= config.database_host,
    port= '5432', user= 'proem_admin', password= config.RDS_password)
except ValueError as valerr:
    print("Unable to connect to database: " + valerr)


# def csv_stream(df):
#     for row in df.values:
#         print(row)
#         yield '|'.join([str(r) for r in row]) + '\n'

def get_rates(dates):
    exchange_rates = []
    for d in dates:
        sleep(0.2)
        exchange_rates.append(literal_eval(requests.get("http://api.fixer.io/" + d + "?base=USD").content))
    return exchange_rates


cursor = conn.cursor()

print("Dropping table...")
cursor.execute("""DROP TABLE IF EXISTS ALLDATA""")
print("Creating table...")
cursor.execute("""CREATE TABLE ALLDATA (Date text,"""
+"""High text,"""
+"""Low text,"""
+"""Mid text,"""
+"""Last text,"""
+"""Bid text,"""
+"""Ask text,"""
+"""Volume text,"""
+ """ Coin text,"""
+ """ Fiat text)"""
)

for currency in supported_currencies:
    for fiat in supported_fiat:
        try :
            cursor.execute("""INSERT INTO ALLDATA SELECT *,'""" + currency + """' AS Coin, '""" + fiat + """' AS Fiat FROM """ + currency + fiat)
            conn.commit()
        except ValueError as valerr:
            print("Unable to populate table: " + valerr)
            conn.rollback()

print("Table created.")
conn.close()
