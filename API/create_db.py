import psycopg2
supported_currencies = ["BTC","ETH", "LTC"]
import config

try:
    conn=psycopg2.connect(dbname= 'proemdbdev', host= config.database_host,
    port= '5432', user= 'proem_admin', password= config.RDS_password)
except ValueError as valerr:
    print("Unable to connect to database: " + valerr)

cursor = conn.cursor()

for currency in supported_currencies:
    try :
        cursor.execute("""DROP TABLE IF EXISTS """ + currency +"""""")
        cursor.execute("""CREATE TABLE """ + currency + """(Date text,"""
        +"""High text,"""
        +"""Low text,"""
        +"""Mid text,"""
        +"""Last text,"""
        +"""Bid text,"""
        +"""Ask text,"""
        +"""Volume text,"""
        +"""Coin text)"""
        )
        f = open(r'data_csv/BITFINEX-' + currency + 'USD.csv', 'r')
        cursor.copy_from(f,currency,sep=',')
        f.close()
        # cursor.execute("""COPY """ + currency + """ FROM 'data_csv/BITFINEX-""" + currency + """USD.csv' WITH (FORMAT csv);""")
    except ValueError as valerr:
        print("Unable to populate table: " + currency)

conn.commit()
print("DB created.")
conn.close()
