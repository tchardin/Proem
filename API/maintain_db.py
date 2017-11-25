import psycopg2
supported_currencies = ["BTC","ETH", "LTC", "BCH", "ETC","ZEC","XMR","XRP","DASH"]
supported_fiat = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD',  'CNY', 'NZD', 'ZAR']
from ast import literal_eval
import numpy as np
import config
import pandas
import requests




try:
    conn=psycopg2.connect(dbname= 'proemdbdev', host= config.database_host,
    port= '5432', user= 'proem_admin', password= config.RDS_password)
except ValueError as valerr:
    print("Unable to connect to database: " + valerr)

cursor = conn.cursor()
rates = literal_eval(requests.get("http://api.fixer.io/latest?base=USD").content)
for currency in supported_currencies:
    for fiat in supported_fiat:
        try :
            pd = pandas.read_csv('data_csv/BITFINEX-' + currency + 'USD.csv')
            row = pd.values[0]
            if (fiat != 'USD'):
                row[1:-1] = np.asfarray(row[1:-1])*rates['rates'][fiat]
            sql = "INSERT INTO " + currency + fiat + " VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(sql,[str(f) for f in row])
            sql_all = "INSERT INTO ALLDATA VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(sql_all,[str(f) for f in row] + [currency] + [fiat])
        except ValueError as valerr:
            print("Unable to populate table: " + currency)

conn.commit()
print("DB updated.")
conn.close()
