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

supported_currencies = ["BTC","ETH", "LTC", "BCH", "ETC","ZEC","XMR"]
supported_fiat = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD',  'CNY', 'NZD', 'ZAR']
supported_currencies_writted = ["bitcoin","ethereum", "litecoin","bitcoin-cash", "ethereum-classic","zcash","monero"]
exchanges = ['BITFINEX','GDAX', 'KRAKEN', 'BITSTAMP']
url_exchanges = ['https://www.bitfinex.com','https://www.gdax.com', 'https://www.kraken.com', 'https://www.bitstamp.net']

url_dict = dict()
for idx,exchange in enumerate(exchanges):
    url_dict[exchange] = url_exchanges[idx]

convert_symbols = dict()
convert_symbols['DASH'] = "dash"
for idx,currency in enumerate(supported_currencies):
    convert_symbols[currency] = supported_currencies_writted[idx]

supported_currencies_exchange = dict()
supported_currencies_exchange['BITFINEX'] = supported_currencies
supported_currencies_exchange['GDAX'] = supported_currencies[0:3]
supported_currencies_exchange['KRAKEN'] = supported_currencies[1:]
supported_currencies_exchange['BITSTAMP'] = supported_currencies[0:3]

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

# class MetricsData(graphene.ObjectType):
#     marketCap =  graphene.String()
#     price =  graphene.String()
#     lastUpdated =  graphene.String()
#     name =  graphene.String()
#     volume24H = graphene.String()
#     percentChange7D =  graphene.String()
#     symbol =  graphene.String()
#     rank =  graphene.String()
#     percentChange1H =  graphene.String()
#     totalSupply =  graphene.String()
#     availableSupply =  graphene.String()
#     percentChange24H =  graphene.String()
#     id =  graphene.String()

class OrderData(graphene.ObjectType):
    price = graphene.String()
    volume = graphene.String()

class CandlesType(graphene.ObjectType):
    name = graphene.String()
    url = graphene.String()
    values = graphene.List(CandlesData)

class TickerType(graphene.ObjectType):
    name = graphene.String()
    url = graphene.String()
    values = graphene.List(TickerData)

class BookType(graphene.ObjectType):
    name = graphene.String()
    date = graphene.String()
    asks = graphene.List(OrderData)
    bids = graphene.List(OrderData)

class MetricsType(graphene.ObjectType):
    sourceName = graphene.String()
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
    ticker = graphene.List(TickerType)
    candles = graphene.List(CandlesType)
    orderBooks = graphene.List(BookType)

class AssetType(graphene.ObjectType):
    name = graphene.String()
    # history = graphene.List(HistoryType)
    metrics = graphene.List(MetricsType)
    # markets = graphene.List(MarketsType)

class SupportedType(graphene.ObjectType):
    markets = graphene.List(graphene.String)
    coins = graphene.List(graphene.String)
    fiats = graphene.List(graphene.String)

class Query(graphene.AbstractType):
    history = graphene.List(HistoryType, coin=graphene.String(), fiat=graphene.String(), dateFrom=graphene.String(),dateTo=graphene.String())
    ticker = graphene.List(TickerType, coin=graphene.String(), fiat=graphene.String(),exchange=graphene.String())
    candles = graphene.List(CandlesType, coin=graphene.String(), fiat=graphene.String(), interval=graphene.String(), exchange=graphene.String())
    books = graphene.List(BookType, coin=graphene.String(), fiat=graphene.String(),exchange=graphene.String())
    metrics = graphene.List(MetricsType, coin=graphene.String(), fiat=graphene.String())
    markets = graphene.List(MarketsType, coin=graphene.String(), fiat=graphene.String(), interval=graphene.String())
    assets = graphene.List(AssetType, coin=graphene.String(), fiat=graphene.String(), interval=graphene.String())
    supported = graphene.List(SupportedType)

    # @graphene.resolve_only_args
    def resolve_history(self, args, context, info):
        History.objects.update()
        fiat = args.get('fiat') or "USD"
        coin = args.get('coin') or "BTC"
        dateFrom, dateTo = args.get('dateFrom'), args.get('dateTo')
        filter = (
            Q(coin__icontains=coin) &
            Q(fiat__icontains=fiat)
        )
        if dateFrom and dateTo:
            return History.objects.filter(filter, date__range=(dateFrom,dateTo)).order_by('date')
        elif dateFrom:
            return History.objects.filter(filter, date__range=(dateFrom,'9999-01-01')).order_by('date')
        elif dateTo:
            return History.objects.filter(filter, date__range=('1999-01-01', dateTo)).order_by('date')
        else:
            return History.objects.filter(filter).order_by('date')


        return History.objects.all()

    def resolve_ticker(self, args, context, info):
        tick = []
        fiat = args.get('fiat') or "USD"
        coin = args.get('coin') or "BTC"
        exchange = args.get('exchange') or "BITFINEX"
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
            tick.append(TickerType(name=exchange,url=url_dict[exchange],values= [bft_ticker]))
        return tick

    def resolve_candles(self, args, context, info):
        interval = args.get('interval') or "1D"
        fiat = args.get('fiat') or "USD"
        coin = args.get('coin') or "BTC"
        exchange = args.get('exchange') or "BITFINEX"
        cand = []
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
            cand.append(CandlesType(name=exchange,url=url_dict[exchange],values=cand_data))
        for i in range(len(cand)):
            cand[i].values = sorted(cand[i].values, key=lambda k: k.date)
        return cand

    def resolve_books(self, args, context, info):
        fiat = args.get('fiat') or "USD"
        coin = args.get('coin') or "BTC"
        exchange = args.get('exchange') or "BITFINEX"
        order_books = []
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
            order_books.append(BookType(name = exchange, date = str(datetime.now()), asks = ask_data, bids = bid_data))
        return order_books

    def resolve_metrics(self, args, context, info):
        fiat = args.get('fiat') or "USD"
        coin = args.get('coin') or "BTC"
        coin = convert_symbols[coin]
        try:
            # print requests.get("https://api.coinmarketcap.com/v1/ticker/%s/?convert=%s"%(coin,fiat))
            r = json.loads(requests.get("https://api.coinmarketcap.com/v1/ticker/%s/?convert=%s"%(coin,fiat)).content)
        except ValueError as valerr:
            print("Failed to get metrics data from coinmarketcap: " + str(valerr))
        metricsData = MetricsType(sourceName = "coinmarketcap",
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
        id= r[0]['id'])

        return [metricsData]

    def resolve_markets(self, args, context, info):
        q = Query()
        markets = [MarketsType(ticker = q.resolve_ticker(args, context, info),
        candles = q.resolve_candles(args, context, info),
        orderBooks = q.resolve_books(args, context, info)
        )]
        return markets

    def resolve_assets(self, args, context, info):
        coin = args.get('coin')
        q = Query()
        if coin:
            assets = [AssetType(name=coin,
            # markets = q.resolve_markets(args, context, info),
            # history = q.resolve_history(args, context, info),
            metrics = q.resolve_metrics(args, context, info)
            )]
        else:
            assets = []
            for coin in supported_currencies:
                args['coin'] = coin
                assets.append(AssetType(name=coin,
                # markets = q.resolve_markets(args, context, info),
                # history = q.resolve_history(args, context, info),
                metrics = q.resolve_metrics(args, context, info)
                ))
        return assets

    def resolve_supported(self, args, context, info):
        s = [SupportedType(markets = exchanges, coins = supported_currencies, fiats = supported_fiat)]
        return s
