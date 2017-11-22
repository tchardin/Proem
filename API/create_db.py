import psycopg2
import config
import numpy as np
from ast import literal_eval
import requests
import pandas
from time import sleep
import StringIO


supported_currencies = ["BTC","ETH", "LTC", "BCH", "ETC","ZEC","XMR"]
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
        sleep(1.0)
        headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
        'Content-Type': 'json',
        }
        try:
            print(d)
            #print literal_eval(requests.get("http://api.fixer.io/" + str(d) + "?base=USD", headers=headers).content)
            exchange_rates.append(literal_eval(requests.get("http://api.fixer.io/" + str(d) + "?base=USD", headers=headers).content))
        except ValueError as valerr:
            print("Unable to populate table: " + str(valerr))
            print(d)
    return exchange_rates


cursor = conn.cursor()

for currency in supported_currencies:
    pd_crypto = pandas.read_csv('data_csv/BITFINEX-' + currency + 'USD.csv')
    print("Collecting exchange rates for " + currency + " lifetime ....")
    exchange_rates = get_rates(pd_crypto['Date'].values)
    for fiat in supported_fiat:
        pd_crypto = pandas.read_csv('data_csv/BITFINEX-' + currency + 'USD.csv')
        # sql = "INSERT INTO " + currency + fiat + " VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        print("Building " + currency + " in " + fiat + " database.......")
        string_buffer = StringIO.StringIO()
        try :
            print("Dropping table...")
            cursor.execute("""DROP TABLE IF EXISTS """ + currency + fiat + """""")
            print("Creating table...")
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
                    except ValueError as valerr:
                        print('valerr :' + str(exchange[i]))

            print("Pushing to PSQL.... \n")

            pd_crypto.to_csv(string_buffer, index=False)
            string_buffer.seek(0)
            cursor.copy_from(string_buffer, currency + fiat,sep=',')
            cursor.execute("DELETE FROM " + currency + fiat + " WHERE volume = 'Volume'")
            string_buffer.close()
            conn.commit()
            # cursor.execute("""COPY """ + currency + """ FROM 'data_csv/BITFINEX-""" + currency + """USD.csv' WITH (FORMAT csv);""")
        except ValueError as valerr:
            print("Unable to populate table: " + valerr)
            conn.rollback()

print("DB created.")
conn.close()
