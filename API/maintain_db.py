import psycopg2
supported_currencies = ["BTC","ETH", "LTC", "BCH", "ETC","ZEC","XMR"]
import config
import pandas

def r(df):
    for idx, row in df.iterrows():
        yield ','.join(map(str, row))

try:
    conn=psycopg2.connect(dbname= 'proemdbdev', host= config.database_host,
    port= '5432', user= 'proem_admin', password= config.RDS_password)
except ValueError as valerr:
    print("Unable to connect to database: " + valerr)

cursor = conn.cursor()

for currency in supported_currencies:
    try :

        pd = pandas.read_csv('data_csv/BITFINEX-' + currency + 'USD.csv')
        sql = "INSERT INTO " + currency + " VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql,[f for f in pd.values[0]])
    except ValueError as valerr:
        print("Unable to populate table: " + currency)

conn.commit()
print("DB updated.")
conn.close()
