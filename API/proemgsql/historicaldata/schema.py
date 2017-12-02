import graphene
import requests
from graphene_django import DjangoObjectType
from historicaldata.models import History
from django.db.models import Q
from django.db import transaction
from ast import literal_eval
import json
import re
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from api_package.functions import *

#list of supported currencies, fiats, and exchanges
supported_currencies = ["BTC","ETH","LTC", "BCH", "ETC","ZEC","XMR","XRP","DASH"]
supported_fiat = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD','CNY','NZD','ZAR']
supported_currencies_written= ["bitcoin","ethereum", "litecoin","bitcoin-cash", "ethereum-classic","zcash","monero","ripple","dash"]
exchanges = ['BITFINEX','GDAX', 'KRAKEN', 'BITSTAMP']
url_exchanges = ['https://www.bitfinex.com','https://www.gdax.com','https://www.kraken.com','https://www.bitstamp.net']

url_dict = dict()
for idx,exchange in enumerate(exchanges):
    url_dict[exchange] = url_exchanges[idx]

#match currencies to their symbols
convert_symbols = dict()
# convert_symbols['DASH'] = "dash"
for idx,currency in enumerate(supported_currencies):
    convert_symbols[currency] = supported_currencies_written[idx]

#match currencies to each exchange
supported_currencies_exchange = dict()
supported_currencies_exchange['BITFINEX'] = supported_currencies
supported_currencies_exchange['GDAX'] = supported_currencies[0:3]
supported_currencies_exchange['KRAKEN'] = supported_currencies
supported_currencies_exchange['BITSTAMP'] = supported_currencies[0:3] + ["XRP"]

#Define API models or `endpoints`:
class HistoryData(DjangoObjectType):
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

class OrderData(graphene.ObjectType):
    price = graphene.String()
    volume = graphene.String()

class HistoryType(graphene.ObjectType):
    coin = graphene.String()
    values = graphene.List(HistoryData)

class CandlesType(graphene.ObjectType):
    exchange = graphene.String()
    coin = graphene.String()
    url = graphene.String()
    values = graphene.List(CandlesData)

class TickerType(graphene.ObjectType):
    exchange = graphene.String()
    coin= graphene.String()
    url = graphene.String()
    values = graphene.List(TickerData)

class BookType(graphene.ObjectType):
    exchange = graphene.String()
    coin = graphene.String()
    date = graphene.String()
    asks = graphene.List(OrderData)
    bids = graphene.List(OrderData)

class MetricsType(graphene.ObjectType):
    sourceName = graphene.String()
    description = graphene.String()
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
    # values = graphene.List(MetricsData)

class MarketsType(graphene.ObjectType):
    coin = graphene.String()
    ticker = graphene.List(TickerType)
    candles = graphene.List(CandlesType)
    orderBooks = graphene.List(BookType)

class AssetType(graphene.ObjectType):
    coin = graphene.String()
    # history = graphene.List(HistoryType)
    metrics = graphene.List(MetricsType)
    # markets = graphene.List(MarketsType)

class SupportedType(graphene.ObjectType):
    markets = graphene.List(graphene.String)
    coins = graphene.List(graphene.String)
    fiats = graphene.List(graphene.String)

#defines query handling
class Query(graphene.AbstractType):
    history = graphene.List(HistoryType, coins=graphene.List(graphene.String), fiat=graphene.String(), dateFrom=graphene.String(),dateTo=graphene.String())
    ticker = graphene.List(TickerType, coins=graphene.List(graphene.String), fiat=graphene.String(),exchange=graphene.String())
    candles = graphene.List(CandlesType, coins=graphene.List(graphene.String), fiat=graphene.String(), interval=graphene.String(), exchange=graphene.String())
    books = graphene.List(BookType, coins=graphene.List(graphene.String), fiat=graphene.String(),exchange=graphene.String())
    metrics = graphene.List(MetricsType, coins=graphene.List(graphene.String), fiat=graphene.String())
    markets = graphene.List(MarketsType, coins=graphene.List(graphene.String), fiat=graphene.String(), interval=graphene.String())
    assets = graphene.List(AssetType, coins=graphene.List(graphene.String), fiat=graphene.String(), interval=graphene.String())
    supported = graphene.List(SupportedType)

    #handles each of the models
    def resolve_history(self, args, context, info):
        History.objects.update()
        fiat = args.get('fiat') or "USD"
        coins = args.get('coins') or ["BTC"]
        dateFrom, dateTo = args.get('dateFrom'), args.get('dateTo')
        result = []
        for coin in coins:
            filter = (
                Q(coin__icontains=coin) &
                Q(fiat__icontains=fiat)
            )
            if dateFrom and dateTo:
                result.append(HistoryType(coin=coin,values=History.objects.filter(filter, date__range=(dateFrom,dateTo)).order_by('date')))
            elif dateFrom:
                result.append(HistoryType(coin=coin,values=History.objects.filter(filter, date__range=(dateFrom,'9999-01-01')).order_by('date')))
            elif dateTo:
                result.append(HistoryType(coin=coin,values=History.objects.filter(filter, date__range=('1999-01-01', dateTo)).order_by('date')))
            else:
                result.append(HistoryType(coin=coin,values=History.objects.filter(filter).order_by('date')))
        return result

    def resolve_ticker(self, args, context, info):
        tick = []
        fiat = args.get('fiat') or "USD"
        coins = args.get('coins') or ["BTC"]
        exchange = args.get('exchange') or "BITFINEX"
        result = []
        for coin in coins:
            try:
                r = []
                rates = get_exchange_rates(fiat)
                if coin in supported_currencies_exchange[exchange]:
                    r.append((exchange, ticker_url(exchange, coin)))
            except ValueError as valerr:
                print("Failed to get current data %s: "%exchange + str(valerr))
            resp = ticker_data(coin, rates, fiat, r)
            if exchange not in resp:
                pass
            else:
                bft_ticker = TickerData( date = resp[exchange][0]['date'],
                high = resp[exchange][0]['high'],
                low = resp[exchange][0]['low'],
                mid = resp[exchange][0]['mid'],
                last = resp[exchange][0]['last'],
                bid = resp[exchange][0]['bid'],
                ask = resp[exchange][0]['ask'],
                volume = resp[exchange][0]['volume'])
                tick.append(TickerType(exchange=exchange,coin=coin, url=url_dict[exchange],values= [bft_ticker]))
        return tick

    def resolve_candles(self, args, context, info):
        interval = args.get('interval') or "1D"
        fiat = args.get('fiat') or "USD"
        coins = args.get('coins') or ["BTC"]
        exchange = args.get('exchange') or "BITFINEX"
        cand = []
        for coin in coins:
            try:
                r = []
                rates = get_exchange_rates(fiat)
                if coin in supported_currencies_exchange[exchange]:
                    r.append((exchange, candles_url(exchange, coin, interval)))
            except ValueError as valerr:
                print("Failed to get current data %s: "%exchange + str(valerr))
            resp = candles_data(coin, rates, fiat, r)
            cand_data=[]
            if exchange not in resp:
                pass
            else:
                for response in resp[exchange]:
                    response['date'] = str(datetime.strptime(response['date'], '%Y-%m-%d %H:%M:%S').date())
                    cand_data.append(CandlesData(date = response['date'],
                    open = response['open'],
                    close = response['close'],
                    high = response['high'],
                    low = response['low'],
                    volume = response['volume']))
                cand.append(CandlesType(exchange=exchange,coin=coin,url=url_dict[exchange],values=cand_data))
            for i in range(len(cand)):
                cand[i].values = sorted(cand[i].values, key=lambda k: k.date)
        return cand

    def resolve_books(self, args, context, info):
        fiat = args.get('fiat') or "USD"
        coins = args.get('coins') or ["BTC"]
        exchange = args.get('exchange') or "BITFINEX"
        order_books = []
        for coin in coins:
            try:
                r = []
                rates = get_exchange_rates(fiat)
                if coin in supported_currencies_exchange[exchange]:
                    r.append((exchange, books_url(exchange, coin)))
            except ValueError as valerr:
                print("Failed to get current data %s: "%exchange + str(valerr))
            resp = books_data(coin, rates, fiat, r)
            if exchange not in resp:
                pass
            else:
                ask_data, bid_data = [],[]
                for ask in resp[exchange][0]['asks']:
                    ask_data.append(OrderData(price = ask[0],volume = ask[1]))
                for bid in resp[exchange][0]['bids']:
                    bid_data.append(OrderData(price = bid[0], volume = bid[1]))
                order_books.append(BookType(exchange=exchange,coin=coin,date=str(datetime.now()),asks=ask_data,bids=bid_data))
        return order_books

    def resolve_metrics(self, args, context, info):
        fiat = args.get('fiat') or "USD"
        coins = args.get('coins') or ["BTC"]
        metricsData = []
        for coin in coins:
            coin_written = convert_symbols[coin]
            try:
                r = json.loads(requests.get("https://api.coinmarketcap.com/v1/ticker/%s/?convert=%s"%(coin_written,fiat)).content)
            except ValueError as valerr:
                print("Failed to get metrics data from coinmarketcap: " + str(valerr))
            metricsData.append(MetricsType(sourceName = "coinmarketcap",
            description = descriptions_coins[coin],
            marketCap= r[0]['market_cap_'+fiat.lower()],
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
            id= r[0]['id']))
        return metricsData

    def resolve_markets(self, args, context, info):
        q = Query()
        coins = args.get('coins') or ["BTC"]
        markets = []
        for coin in coins:
            args['coins'] = [coin]
            markets.append(MarketsType(coin=coin,ticker = q.resolve_ticker(args, context, info),
            candles = q.resolve_candles(args, context, info),
            orderBooks = q.resolve_books(args, context, info)
            ))
        return markets

    def resolve_assets(self, args, context, info):
        coins = args.get('coins')
        q = Query()
        if coins:
            assets = []
            for coin in coins:
                args['coins'] = [coin]
                assets.append(AssetType(coin=coin,
                metrics = q.resolve_metrics(args, context, info)
                ))
        else:
            assets = []
            for coin in supported_currencies:
                args['coins'] = [coin]
                assets.append(AssetType(coin=coin,
                # markets = q.resolve_markets(args, context, info),
                # history = q.resolve_history(args, context, info),
                metrics = q.resolve_metrics(args, context, info)
                ))
        return assets

    def resolve_supported(self, args, context, info):
        s = [SupportedType(markets = exchanges, coins = supported_currencies, fiats = supported_fiat)]
        return s
