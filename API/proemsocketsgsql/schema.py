import asyncio
import graphene
import websocket
import _thread as thread
import time
import json
import ast
import requests
from datetime import datetime, timedelta


websocket.enableTrace(True)

ticker_keys = ["date","high","low","mid","last","bid","ask","volume"]

def kraken_string_format(coin):
    if coin in ["LTC","BTC","ETH", "ETC", "ZEC", "XMR"]:
        return 'X'+coin+'ZUSD'
    else:
        return coin+'USD'

ws_bft = websocket.create_connection("wss://api.bitfinex.com/ws/2")
ws_bft.send(json.dumps({
"event": "subscribe",
"channel": "ticker",
"symbol": "tBTCUSD"
}))

ws_gdt = websocket.create_connection("wss://ws-feed.gdax.com")
ws_gdt.send(json.dumps(
{
    "type": "subscribe",
    "product_ids": [
        "BTC-USD",
    ],
    "channels": [
        "ticker"
        # "level2"
    ]
}
))

# ws_bfb = websocket.create_connection("wss://api.bitfinex.com/ws/2")
# ws_bft.send(json.dumps({
# "event": "subscribe",
# "channel": "book",
# "symbol": "tBTCUSD"
# }))
#
# ws_bfc = websocket.create_connection("wss://api.bitfinex.com/ws/2")
# ws_bft.send(json.dumps({
# "event": "subscribe",
# "channel": "candles",
# "key": "trade:1m:tBTCUSD"
# }))


class TickerData(graphene.ObjectType):
    date = graphene.String()
    high = graphene.String()
    low = graphene.String()
    mid = graphene.String()
    last = graphene.String()
    bid = graphene.String()
    ask = graphene.String()
    volume = graphene.String()

class TickerType(graphene.ObjectType):
    name = graphene.String()
    url = graphene.String()
    values = graphene.List(TickerData)

class Query(graphene.ObjectType):
    base = graphene.String()

class Subscription(graphene.ObjectType):
    bft_ticker = graphene.String()
    # bft_books = graphene.String()
    # bft_candles = graphene.String()
    gdax_ticker = graphene.String()
    # gdax_books = graphene.String()
    # gdax_candles = graphene.String()
    kraken_ticker = graphene.String()
    # kraken_books = graphene.String()
    # kraken_candles = graphene.String()

    async def resolve_bft_ticker(root, info):
        while True:
            resp = ws_bft.recv()
            await asyncio.sleep(1.)
            resp = ast.literal_eval(resp)
            if (not isinstance(resp, dict)):
                if (not isinstance(resp[1], str)):
                    data = [str(datetime.now())] + [float(resp[1][i]) for i in [-2,-1,-4,0,2,-3]]
                    data.insert(3,(data[1]+data[2])/2.0)
                    resp = dict(zip(tuple(ticker_keys), data))
                    yield str(resp)

    async def resolve_gdax_ticker(root, info):
        while True:
            resp = ws_gdt.recv()
            print(resp)
            await asyncio.sleep(1.)
            resp = ast.literal_eval(resp)
            data = [str(datetime.now())] + [float(resp[i]) for i in ["high_24h","low_24h","price","best_bid","best_ask","volume_24h"]]
            data.insert(3,(data[1]+data[2])/2.0)
            resp = dict(zip(tuple(ticker_keys), data))
            yield(str(resp))

    async def resolve_kraken_ticker(root, info):
        while True:
            r = json.loads(requests.get('https://api.kraken.com/0/public/Ticker?pair=ETHUSD').content)
            print(r)
            await asyncio.sleep(4.)
            data = [str(datetime.now())] + [float(r['result'][kraken_string_format("ETH")][i][0]) for i in ['h','l','c','b','a','v']]
            data.insert(3,(data[1]+data[2])/2.0)
            resp = dict(zip(tuple(ticker_keys), data))
            yield str(resp)



    # async def resolve_bft_books(root, info):
    #     while True:
    #         resp = ws_bfb.recv()
    #         await asyncio.sleep(1.)
    #         resp = ast.literal_eval(resp)
    #         if (not isinstance(resp, dict)):
    #             if (not isinstance(resp[1], str)):
    #                 # print('received results books: ' + str(resp) )
    #                 yield resp[1]

    # async def resolve_bft_candles(root, info):
    #     while True:
    #         resp = ws_bfc.recv()
    #         await asyncio.sleep(1.)
    #         resp = ast.literal_eval(resp)
    #         if (not isinstance(resp, dict)):
    #             if (not isinstance(resp[1], str)):
    #                 # print('received results candles: ' + str(resp) )
    #                 yield resp[1]





schema = graphene.Schema(query=Query, subscription=Subscription)
