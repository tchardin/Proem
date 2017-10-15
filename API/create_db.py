import psycopg2
import config
import numpy as np
from ast import literal_eval
import requests
import pandas
from time import sleep
import cStringIO


supported_currencies = ["BTC","ETH", "LTC", "BCH", "ETC","ZEC","XMR"]
supported_fiat = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD',  'CNY', 'NZD', 'ZAR']


try:
    conn=psycopg2.connect(dbname= 'proemdbdev', host= config.database_host,
    port= '5432', user= 'proem_admin', password= config.RDS_password)
except ValueError as valerr:
    print("Unable to connect to database: " + valerr)


def csv_stream(df):
    for idx, row in df.iterrows():
        yield ','.join(map(str, row))

def get_rates(dates):
    exchange_rates = []
    for d in dates:
        sleep(0.2)
        exchange_rates.append(literal_eval(requests.get("http://api.fixer.io/" + d + "?base=USD").content))
    return exchange_rates


cursor = conn.cursor()

for currency in supported_currencies:
    pd_crypto = pandas.read_csv('data_csv/BITFINEX-' + currency + 'USD.csv')
    print("Collecting exchange rates for " + currency + " lifetime ....")
    exchange_rates = get_rates(pd_crypto['Date'].values)
    for fiat in supported_fiat:
        # sql = "INSERT INTO " + currency + fiat + " VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        print("Building " + currency + " in " + fiat + " database.......")
        string_buffer = cStringIO.StringIO()
        try :
            cursor.execute("""DROP TABLE IF EXISTS """ + currency + fiat + """""")
            cursor.execute("""CREATE TABLE """ + currency + fiat + """(Date text,"""
            +"""High text,"""
            +"""Low text,"""
            +"""Mid text,"""
            +"""Last text,"""
            +"""Bid text,"""
            +"""Ask text,"""
            +"""Volume text)"""
            )
            if (fiat != 'USD'):
                print("Converting USD to " + fiat + ".......")
                for idx,rate in enumerate(exchange_rates):
                    try:
                        pd_crypto.iloc[idx,1:-1] = pd_crypto.iloc[idx,1:-1]*rate['rates'][fiat]
                        # row = pd_crypto.iloc[idx,:].values
                        # cursor.execute(sql,[f for f in row])
                    except ValueError as valerr:
                        print('valerr :' + str(exchange[i]))
            data_stream = csv_stream(pd_crypto)
            for point in data_stream:
                string_buffer.write(point + '\n')
            print("Pushing to PSQL....")
            cursor.copy_from(string_buffer, currency + fiat, sep = ',')
            string_buffer.close()

            # cursor.execute("DELETE FROM " + currency + fiat + " WHERE volume = 'Volume'")
            # cursor.execute("""COPY """ + currency + """ FROM 'data_csv/BITFINEX-""" + currency + """USD.csv' WITH (FORMAT csv);""")
        except ValueError as valerr:
            print("Unable to populate table: " + valerr)
            conn.rollback()

conn.commit()
print("DB created.")
conn.close()
