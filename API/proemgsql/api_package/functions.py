
from ast import literal_eval
import requests
import json
import re
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

def get_exchange_rates(fiat):
    if (fiat != 'USD'):
        rates = json.loads(requests.get("http://api.fixer.io/latest?base=USD").content)
    else:
        rates = {'rates': {fiat: 1}}
    return rates

def ticker_url(market, coin):
    if market == 'BITFINEX':
        bfx_coin = 't{0}USD'.format(coin)
        r = json.loads(requests.get("https://api.bitfinex.com/v2/ticker/%s"%bfx_coin).content)
    elif market == 'GDAX':
        gdx_coin = '{0}-USD'.format(coin)
        r = json.loads(requests.get('https://api.gdax.com/products/%s/ticker'%gdx_coin).content)
    elif market == 'KRAKEN':
        krk_coin = '{0}USD'.format(coin)
        r = json.loads(requests.get('https://api.kraken.com/0/public/Ticker?pair=%s'%krk_coin).content)
    elif market == 'BITSTAMP':
        btsmp_coin = '{0}USD'.format(coin).lower()
        r = json.loads(requests.get('https://www.bitstamp.net/api/v2/ticker/%s'%btsmp_coin).content)
    return r

def kraken_string_format(coin):
    if coin in ["LTC","BTC","ETH", "ETC", "ZEC", "XMR"]:
        return 'X'+coin+'ZUSD'
    else:
        return coin+'USD'

def ticker_data(coin, rates, fiat, responses):
    ticker_keys = ["date","high","low","mid","last","bid","ask","volume"]
    resp_dict = dict()
    for resp in responses:
        if resp[1] is None:
            market = resp[0]
            resp_dict[market] = None
        else:
            market = resp[0]
            r = resp[1]
            if market == 'BITFINEX':
                data = [str(datetime.now())] + [float(r[i])*rates['rates'][fiat] for i in [-2,-1,-4,0,2,-3]]
                data.insert(3,(data[1]+data[2])/2.0)
            elif market == 'GDAX':
                gdx_coin = '{0}-USD'.format(coin)
                r2 = json.loads(requests.get('https://api.gdax.com/products/%s/stats'%gdx_coin).content)
                data = [str(datetime.now())] + [float(r2[i])*rates['rates'][fiat] for i in ['high','low']] + [float(r[i])*rates['rates'][fiat] for i in ['price','bid','ask','volume']]
                data.insert(3,(data[1]+data[2])/2.0)
            elif market == 'KRAKEN':
                data = [str(datetime.now())] + [float(r['result'][kraken_string_format(coin)][i][0])*rates['rates'][fiat] for i in ['h','l','c','b','a','v']]
                data.insert(3,(data[1]+data[2])/2.0)
            elif market == 'BITSTAMP':
                data = [str(datetime.now())] + [float(r[i])*rates['rates'][fiat] for i in ['high','low','last','bid','ask','volume']]
                data.insert(3,(data[1]+data[2])/2.0)
            resp_dict[market] = [dict(zip(tuple(ticker_keys), data))]
    return resp_dict



def roundTimeSeconds(dt=None, roundTo=60):
   if dt == None : dt = datetime.now()
   seconds = (dt.replace(tzinfo=None) - dt.min).seconds
   rounding = seconds// roundTo * roundTo
   return dt + timedelta(0,rounding-seconds,-dt.microsecond)

def convert_interval_KRAKEN(interval):
    if interval in ['1m','5m','10m','30m']:
        r = re.findall(r'\d+', interval)
        return r[0]
    elif interval == '1h':
        return '60'
    elif interval in ['3h','6h','12h']:
        return '240'
    elif interval == '1D':
        return '1440'
    elif interval == '7D':
        return '10080'
    elif interval in ['14D','1M']:
        return '21600'

def convert_interval_GDAX(interval, granularity):
    end = datetime.now()
    if interval in ['1m','5m','10m','30m']:
        r = int(re.findall(r'\d+', interval)[0])
        end = roundTimeSeconds(dt=end,roundTo=r*60)
        start = end - timedelta(minutes=granularity*r)
        granularity = 60*r
    elif interval in ['1h','3h','12h']:
        r = int(re.findall(r'\d+', interval)[0])
        end = roundTimeSeconds(dt=end,roundTo=r*60*60)
        start = end - timedelta(minutes=granularity*60*r)
        granularity = 60*60*r
    elif interval in ['1D','7D','14D']:
        r = int(re.findall(r'\d+', interval)[0])
        if interval == '1D':
            end = end.replace(hour = 0, second = 0, microsecond = 0)
        else:
            end = end.replace(hour = 0, second = 0, microsecond = 0)-timedelta(days=1)
        start = end - timedelta(days=granularity*r)
        granularity = 60*60*24*r
    elif interval == '1M':
        end = end.replace(day = 1, hour = 0, second = 0, microsecond = 0)
        start = end - relativedelta(months=200)
        granularity = 30*24*60*60
    return start.isoformat(), end.isoformat(), granularity

def convert_interval_BITSTAMP(interval):
    if interval in ['1m','5m','10m']:
        return 'minute'
    elif interval in ['30m', '1h','3h','12h']:
        return 'hour'
    else:
        return 'day'

def candles_url(market,coin, interval):
    if market == 'BITFINEX':
        bfx_coin = 't{0}USD'.format(coin)
        r = json.loads(requests.get("https://api.bitfinex.com/v2/candles/trade:%s:%s/hist?limit=200"%(interval,bfx_coin)).content)
    elif market == 'GDAX':
        gdx_coin = '{0}-USD'.format(coin)
        start, end, granularity = convert_interval_GDAX(interval,200)
        r = json.loads(requests.get('https://api.gdax.com/products/%s/candles?start=%s&end=%s&granularity=%s'%(gdx_coin,str(start),str(end),str(granularity))).content)
        # print('https://api.gdax.com/products/%s/candles?start=%s&end=%s&granularity=%s'%(gdx_coin,str(start),str(end),str(granularity)))
    elif market == 'KRAKEN':
        krk_coin = '{0}USD'.format(coin)
        interval = convert_interval_KRAKEN(interval)
        r = json.loads(requests.get('https://api.kraken.com/0/public/OHLC?pair=%s&interval=%s'%(krk_coin,interval)).content)
    elif market == 'BITSTAMP':
        btsmp_coin = '{0}USD'.format(coin).lower()
        interval = convert_interval_BITSTAMP(interval)
        r = json.loads(requests.get('https://www.bitstamp.net/api/v2/transactions/%s/?time=%s'%(btsmp_coin,interval)).content)
    return r

def candles_data(coin, rates, fiat, responses):
    candles_keys = ["date", "open", "close", "high", "low", "volume"]
    resp_dict = dict()
    for resp in responses:
        if resp[1] is None:
            market = resp[0]
            resp_dict[market] = None
        else:
            market = resp[0]
            r = resp[1]
            data = []
            if market == 'BITFINEX':
                for point in r:
                    data.append([str(datetime.fromtimestamp(point[0]//1000.0))] + [float(point[i])*rates['rates'][fiat] for i in range(1,len(point))])
            elif market == 'GDAX':
                for point in r:
                    data.append([str(datetime.fromtimestamp(int(point[0])))] + [float(point[i])*rates['rates'][fiat] for i in [3,4,2,1,5]])
            elif market == 'KRAKEN':
                for point in r['result'][kraken_string_format(coin)]:
                    data.append([str(datetime.fromtimestamp(int(point[0])))] + [float(point[i])*rates['rates'][fiat] for i in [1,4,2,3,6]])
            elif market == 'BITSTAMP':
                for point in r:
                    data.append([str(datetime.fromtimestamp(int(point['date'])))] + [float(point[i])*rates['rates'][fiat] for i in ['price','price','price','price','amount']])
            resp_dict[market] = [dict(zip(tuple(candles_keys), d)) for d in data]
    return resp_dict

def books_url(market,coin):
    if market == 'BITFINEX':
        bfx_coin = 't{0}USD'.format(coin)
        r = json.loads(requests.get("https://api.bitfinex.com/v2/book/%s/P0"%(bfx_coin)).content)
    elif market == 'GDAX':
        gdx_coin = '{0}-USD'.format(coin)
        r = json.loads(requests.get('https://api.gdax.com/products/%s/book?level=2'%(gdx_coin)).content)
        # print('https://api.gdax.com/products/%s/candles?start=%s&end=%s&granularity=%s'%(gdx_coin,str(start),str(end),str(granularity)))
    elif market == 'KRAKEN':
        krk_coin = '{0}USD'.format(coin)
        r = json.loads(requests.get('https://api.kraken.com/0/public/Depth?pair=%s'%(krk_coin)).content)
    elif market == 'BITSTAMP':
        btsmp_coin = '{0}USD'.format(coin).lower()
        r = json.loads(requests.get('https://www.bitstamp.net/api/v2/order_book/%s'%(btsmp_coin)).content)
    return r

def books_data(coin, rates, fiat, responses):
    resp_dict = dict()
    for resp in responses:
        if resp[1] is None:
            market = resp[0]
            resp_dict[market] = None
        else:
            market = resp[0]
            book = resp[1]
        if market == 'BITFINEX':
            asks,bids = [],[]
            for order in book:
                if (order[2] < 0):
                    asks.append([float(order[0])*rates['rates'][fiat], order[1]] )
                else:
                    bids.append([float(order[0])*rates['rates'][fiat], order[1]])
        else:
            asks,bids = [],[]
            if market == 'KRAKEN':
                book =  book['result'][kraken_string_format(coin)]
            for ask in book['asks']:
                asks.append([float(ask[0])*rates['rates'][fiat], ask[1]])
            for bid in book['bids']:
                bids.append([float(bid[0])*rates['rates'][fiat],bid[1:]])
        resp_dict[market] = [{'asks': asks, 'bids': bids}]
    return resp_dict
