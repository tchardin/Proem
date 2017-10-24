import graphene
import requests
from graphene_django import DjangoObjectType
from historicaldata.models import History
from django.db.models import Q
from ast import literal_eval
from json import dumps
from datetime import datetime, timedelta



supported_currencies = ["BTC","ETH", "LTC", "BCH", "ETC","ZEC","XMR"]
supported_fiat = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD',  'CNY', 'NZD', 'ZAR']
supported_currencies_writted = ["bitcoin","ethereum", "litecoin","bitcoin-cash", "ethereum-classic","zcash","dash","monero"]

exchanges = ['BITFINEX','GDAX', 'KRAKEN']

convert_symbols = dict()
convert_symbols['DASH'] = "dash"
for idx,currency in enumerate(supported_currencies):
    convert_symbols[currency] = supported_currencies_writted[idx]

supported_currencies_exchange = dict()
supported_currencies_exchange['BITFINEX'] = supported_currencies
supported_currencies_exchange['GDAX'] = supported_currencies[0:3]
supported_currencies_exchange['KRAKEN'] = supported_currencies[1:]


def get_exchange_rates(fiat):
    if (fiat != 'USD'):
        rates = literal_eval(requests.get("http://api.fixer.io/latest?base=USD").content)
    else:
        rates = {'rates': {fiat: 1}}
    return rates

def ticker_url(market, coin):
    if market == 'BITFINEX':
        bfx_coin = 't{0}USD'.format(coin)
        r = literal_eval(requests.get("https://api.bitfinex.com/v2/ticker/%s"%bfx_coin).content)
    elif market == 'GDAX':
        gdx_coin = '{0}-USD'.format(coin)
        r = literal_eval(requests.get('https://api.gdax.com/products/%s/ticker'%gdx_coin).content)
    elif market == 'KRAKEN':
        krk_coin = '{0}USD'.format(coin)
        r = literal_eval(requests.get('https://api.kraken.com/0/public/Ticker?pair=%s'%krk_coin).content)
    return r

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
                r2 = literal_eval(requests.get('https://api.gdax.com/products/%s/stats'%gdx_coin).content)
                data = [str(datetime.now())] + [float(r2[i]) for i in ['high','low']] + [float(r[i]) for i in ['price','bid','ask','volume']]
                data.insert(3,(data[1]+data[2])/2.0)
            elif market == 'KRAKEN':
                data = [str(datetime.now())] + [float(r['result']['X'+coin+'ZUSD'][i][0])*rates['rates'][fiat] for i in ['h','l','c','b','a','v']]
                data.insert(3,(data[1]+data[2])/2.0)
            resp_dict[market] = [dict(zip(tuple(ticker_keys), data))]
    return resp_dict



def roundTimeSeconds(dt=None, roundTo=60):
   if dt == None : dt = datetime.now()
   seconds = (dt.replace(tzinfo=None) - dt.min).seconds
   rounding = seconds// roundTo * roundTo
   return dt + timedelta(0,rounding-seconds,-dt.microsecond)

def convert_interval_KRAKEN(interval):
    if interval == '1m':
        return '1'
        granularity = 60
    elif interval == '5m':
        return '5'
        granularity = 5*60
    elif interval == '10m':
        return '15'
        granularity = 10*60
    elif interval == '30m':
        return '30'
    elif interval == '1h':
        return '60'
    elif interval == '3h':
        return '240'
    elif interval == '6h':
        return '240'
    elif interval == '12h':
        return '240'
    elif interval == '1D':
        return '1440'
    elif interval == '7D':
        return '10080'
    elif interval == '14D':
        return '21600'
    elif interval == '1M':
        return '21600'

def convert_interval_GDAX(interval, granularity):
    end = datetime.now()
    if interval == '1m':
        end = roundTimeSeconds(dt=end,roundTo=60)
        start = end - timedelta(minutes=granularity*1)
        granularity = 60
    elif interval == '5m':
        end = roundTimeSeconds(dt=end,roundTo=5*60)
        start = end - timedelta(minutes=granularity*5)
        granularity = 5*60
    elif interval == '10m':
        end = roundTimeSeconds(dt=end,roundTo=10*60)
        start = end - timedelta(minutes=granularity*10)
        granularity = 10*60
    elif interval == '30m':
        end = roundTimeSeconds(dt=end,roundTo=30*60)
        start = end - timedelta(minutes=granularity*30)
        granularity = 30*60
    elif interval == '1h':
        end = roundTimeSeconds(dt=end,roundTo=60*60)
        start = end - timedelta(minutes=granularity*60)
        granularity = 60*60
    elif interval == '3h':
        end = roundTimeSeconds(dt=end,roundTo=3*60*60)
        start = end - timedelta(minutes=granularity*3*60)
        granularity = 3*60*60
    elif interval == '6h':
        end = roundTimeSeconds(dt=end,roundTo=6*60*60)
        start = end - timedelta(minutes=granularity*6*60)
        granularity = 6*60*60
    elif interval == '12h':
        end = roundTimeSeconds(dt=end,roundTo=12*60*60)
        start = end - timedelta(minutes=granularity*12*60)
        granularity = 12*60*60
    elif interval == '1D':
        end = end.replace(hour = 0, second = 0, microsecond = 0)
        start = end - timedelta(days=granularity)
        granularity = 24*60*60
    elif interval == '7D':
        end = end.replace(hour = 0, second = 0, microsecond = 0)-timedelta(days=1)
        start = end - timedelta(days=granularity*7)
        granularity = 7*24*60*60
    elif interval == '14D':
        end = end.replace(hour = 0, second = 0, microsecond = 0)-timedelta(days=1)
        start = end - timedelta(days=granularity*14)
        granularity = 14*24*60*60
    elif interval == '1M':
        end = end.replace(day = 1, hour = 0, second = 0, microsecond = 0)
        start = end - relativedelta(months=200)
        granularity = 30*24*60*60
    return start.isoformat(), end.isoformat(), granularity


def candles_url(market,coin, interval):
    if market == 'BITFINEX':
        bfx_coin = 't{0}USD'.format(coin)
        r = literal_eval(requests.get("https://api.bitfinex.com/v2/candles/trade:%s:%s/hist?limit=200"%(interval,bfx_coin)).content)
    elif market == 'GDAX':
        gdx_coin = '{0}-USD'.format(coin)
        start, end, granularity = convert_interval_GDAX(interval,200)
        r = literal_eval(requests.get('https://api.gdax.com/products/%s/candles?start=%s&end=%s&granularity=%s'%(gdx_coin,str(start),str(end),str(granularity))).content)
        # print('https://api.gdax.com/products/%s/candles?start=%s&end=%s&granularity=%s'%(gdx_coin,str(start),str(end),str(granularity)))
    elif market == 'KRAKEN':
        krk_coin = '{0}USD'.format(coin)
        interval = convert_interval_KRAKEN(interval)
        r = literal_eval(requests.get('https://api.kraken.com/0/public/OHLC?pair=%s&interval=%s'%(krk_coin,interval)).content)
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
            for point in r['result'][coin+fiat]:
                data.append([str(datetime.now())] + [float(point[i])*rates['rates'][fiat] for i in [1,4,2,3,6]])
        resp_dict[market] = [dict(zip(tuple(candles_keys), d)) for d in data]
    return resp_dict



class HistoryType(DjangoObjectType):
    class Meta:
        model = History

class TickerData(graphene.ObjectType):
    date = graphene.String()
    high = graphene.String()
    low = graphene.String()
    mid = graphene.String()
    last = graphene.String()
    bid = graphene.String()
    ask = graphene.String()
    volume = graphene.String()

class CandlesData(graphene.ObjectType):
    date = graphene.String()
    open = graphene.String()
    close = graphene.String()
    high = graphene.String()
    low = graphene.String()
    volume = graphene.String()

class MetricsData(graphene.ObjectType):
    marketCap =  graphene.String()
    price =  graphene.String()
    lastUpdated =  graphene.String()
    name =  graphene.String()
    volume24H = graphene.String()
    percentChange7D =  graphene.String()
    symbol =  graphene.String()
    rank =  graphene.String()
    percentChange1H =  graphene.String()
    totalSupply =  graphene.String()
    availableSupply =  graphene.String()
    percentChange24H =  graphene.String()
    id =  graphene.String()

class CandlesType(graphene.ObjectType):
    name = graphene.String()
    values = graphene.List(CandlesData)

class TickerType(graphene.ObjectType):
    name = graphene.String()
    values = graphene.List(TickerData)

class MetricsType(graphene.ObjectType):
    name = graphene.String()
    values = graphene.List(MetricsData)

class MarketsType(graphene.ObjectType):
    ticker = graphene.List(TickerType)
    candles = graphene.List(CandlesType)

class AssetType(graphene.ObjectType):
    name = graphene.String()
    history = graphene.List(HistoryType)
    metrics = graphene.List(MetricsType)
    markets = graphene.List(MarketsType)


class Query(graphene.AbstractType):
    history = graphene.List(HistoryType, coin=graphene.String(), fiat=graphene.String())
    ticker = graphene.List(TickerType, coin=graphene.String(), fiat=graphene.String())
    candles = graphene.List(CandlesType, coin=graphene.String(), fiat=graphene.String(), interval=graphene.String())
    metrics = graphene.List(MetricsType, coin=graphene.String(), fiat=graphene.String())
    markets = graphene.List(MarketsType, coin=graphene.String(), fiat=graphene.String(), interval=graphene.String())
    asset = graphene.List(AssetType, coin=graphene.String(), fiat=graphene.String(), interval=graphene.String())

    # @graphene.resolve_only_args
    def resolve_history(self, args, context, info):
        coin = args.get('coin')
        fiat = args.get('fiat')
        if coin and fiat:
            filter = (
                Q(coin__icontains=coin) &
                Q(fiat__icontains=fiat)
            )
            return History.objects.filter(filter)

        return History.objects.all()

    def resolve_ticker(self, args, context, info):
        tick = []
        fiat = args.get('fiat')
        coin = args.get('coin')
        try:
            r = []
            rates = get_exchange_rates(fiat)
            for exchange in exchanges:
                if coin in supported_currencies_exchange[exchange]:
                    r.append((exchange, ticker_url(exchange, coin)))
        except ValueError as valerr:
            print("Failed to get current data %s: "%market + str(valerr))
        resp = ticker_data(coin, rates, fiat, r)
        for exchange in exchanges:
            if exchange not in resp:
                pass
            else:
                bft_ticker = TickerData( date = resp['BITFINEX'][0]['date'],
                high = resp[exchange][0]['high'],
                low = resp[exchange][0]['low'],
                bid = resp[exchange][0]['bid'],
                ask = resp[exchange][0]['ask'],
                volume = resp[exchange][0]['volume'])
                tick.append(TickerType(name=exchange, values= [bft_ticker]))
        return tick

    def resolve_candles(self, args, context, info):
        interval = args.get('interval')
        fiat = args.get('fiat')
        coin = args.get('coin')
        cand = []
        try:
            r = []
            rates = get_exchange_rates(fiat)
            for exchange in exchanges:
                if coin in supported_currencies_exchange[exchange]:
                    r.append((exchange, candles_url(exchange, coin, interval)))
        except ValueError as valerr:
            print("Failed to get current data %s: "%market + str(valerr))
        resp = candles_data(coin, rates, fiat, r)
        for exchange in exchanges:
            cand_data=[]
            if exchange not in resp:
                pass
            else:
                for re in resp[exchange]:
                    cand_data.append(CandlesData(date = re['date'],
                    open = re['open'],
                    close = re['close'],
                    high = re['high'],
                    low = re['low'],
                    volume = re['volume']))
                cand.append(CandlesType(name=exchange,values=cand_data))
        return cand

    def resolve_metrics(self, args, context, info):
        fiat = args.get('fiat')
        coin = args.get('coin')
        coin = convert_symbols[coin]
        try:
            r = literal_eval(requests.get("https://api.coinmarketcap.com/v1/ticker/%s/?convert=%s"%(coin,fiat)).content)
        except ValueError as valerr:
            print("Failed to get metrics data from coinmarketcap: " + str(valerr))
        print r[0]['market_cap_'+fiat.lower()]
        metricsData = MetricsData(marketCap= r[0]['market_cap_'+fiat.lower()],
        price= r[0]['price_'+fiat.lower()],
        lastUpdated= r[0]['last_updated'],
        name= r[0]['name'],
        volume24H = r[0]['24h_volume_'+fiat.lower()],
        percentChange7D= r[0]['percent_change_7d'],
        symbol= r[0]['symbol'],
        rank= r[0]['rank'],
        percentChange1H= r[0]['percent_change_1h'],
        totalSupply= r[0]['total_supply'],
        availableSupply= r[0]['available_supply'],
        percentChange24H= r[0]['percent_change_24h'],
        id= r[0]['id'])

        metrics = [MetricsType(name = "coinmarketcap", values = [metricsData])]

        return metrics

    def resolve_market(self, args, context, info):
        q = Query()
        markets = [MarketsType(ticker = q.resolve_ticker(args, context, info),
        candles = q.resolve_candles(args, context, info)
        )]
        return markets

    def resolve_asset(self, args, context, info):
        coin = args.get('coin')
        q = Query()
        asset = [AssetType(name=coin,
        markets = q.resolve_market(args, context, info),
        history = q.resolve_history(args, context, info),
        metrics = q.resolve_metrics(args, context, info)
        )]
        return asset
