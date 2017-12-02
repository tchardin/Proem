from ast import literal_eval
import requests
import json
import re
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

# get fiat to fiat exchange rates
def get_exchange_rates(fiat):
    if (fiat != 'USD'):
        rates = json.loads(requests.get("http://api.fixer.io/latest?base=USD").content)
    else:
        rates = {'rates': {fiat: 1}}
    return rates

# get urls for tickers
def ticker_url(market, coin):
    if market == 'BITFINEX':
        if(coin=="DASH"): coin = "DSH"
        bfx_coin = 't{0}USD'.format(coin)
        r = json.loads(requests.get("https://api.bitfinex.com/v2/ticker/%s"%bfx_coin).content)
    elif market == 'GDAX':
        gdx_coin = '{0}-USD'.format(coin)
        r = json.loads(requests.get('https://api.gdax.com/products/%s/ticker'%gdx_coin).content)
    elif market == 'KRAKEN':
        if(coin=="BTC"): coin = "XBT"
        krk_coin = '{0}USD'.format(coin)
        r = json.loads(requests.get('https://api.kraken.com/0/public/Ticker?pair=%s'%krk_coin).content)
    elif market == 'BITSTAMP':
        btsmp_coin = '{0}USD'.format(coin).lower()
        r = json.loads(requests.get('https://www.bitstamp.net/api/v2/ticker/%s'%btsmp_coin).content)
    return r

# format strings for Kraken irregularities
def kraken_string_format(coin):
    if coin in ["LTC","ETH","ETC","ZEC","XMR","XRP"]:
        return 'X'+coin+'ZUSD'
    elif coin in ["BTC"]:
        return 'XXBTZUSD'
    else:
        return coin+'USD'

# format returned ticker data
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

# round time seconds
def roundTimeSeconds(dt=None, roundTo=60):
   if dt == None : dt = datetime.now()
   seconds = (dt.replace(tzinfo=None) - dt.min).seconds
   rounding = seconds// roundTo * roundTo
   return dt + timedelta(0,rounding-seconds,-dt.microsecond)

# convert time intervals to kraken format
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

# convert time intervals to GDAX format
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

# convert time intervals to Bistamp format
def convert_interval_BITSTAMP(interval):
    if interval in ['1m','5m','10m']:
        return 'minute'
    elif interval in ['30m', '1h','3h','12h']:
        return 'hour'
    else:
        return 'day'

# retrieve candles url
def candles_url(market,coin, interval):
    if market == 'BITFINEX':
        if(coin=="DASH"): coin = "DSH"
        bfx_coin = 't{0}USD'.format(coin)
        r = json.loads(requests.get("https://api.bitfinex.com/v2/candles/trade:%s:%s/hist?limit=200"%(interval,bfx_coin)).content)
    elif market == 'GDAX':
        gdx_coin = '{0}-USD'.format(coin)
        start, end, granularity = convert_interval_GDAX(interval,200)
        r = json.loads(requests.get('https://api.gdax.com/products/%s/candles?start=%s&end=%s&granularity=%s'%(gdx_coin,str(start),str(end),str(granularity))).content)
        # print('https://api.gdax.com/products/%s/candles?start=%s&end=%s&granularity=%s'%(gdx_coin,str(start),str(end),str(granularity)))
    elif market == 'KRAKEN':
        if(coin=="BTC"): coin = "XBT"
        krk_coin = '{0}USD'.format(coin)
        interval = convert_interval_KRAKEN(interval)
        r = json.loads(requests.get('https://api.kraken.com/0/public/OHLC?pair=%s&interval=%s'%(krk_coin,interval)).content)
    elif market == 'BITSTAMP':
        btsmp_coin = '{0}USD'.format(coin).lower()
        interval = convert_interval_BITSTAMP(interval)
        r = json.loads(requests.get('https://www.bitstamp.net/api/v2/transactions/%s/?time=%s'%(btsmp_coin,interval)).content)
    return r

# format candles data
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

# retrieve order books urls
def books_url(market,coin):
    if market == 'BITFINEX':
        if(coin=="DASH"): coin = "DSH"
        bfx_coin = 't{0}USD'.format(coin)
        r = json.loads(requests.get("https://api.bitfinex.com/v2/book/%s/P0"%(bfx_coin)).content)
    elif market == 'GDAX':
        gdx_coin = '{0}-USD'.format(coin)
        r = json.loads(requests.get('https://api.gdax.com/products/%s/book?level=2'%(gdx_coin)).content)
        # print('https://api.gdax.com/products/%s/candles?start=%s&end=%s&granularity=%s'%(gdx_coin,str(start),str(end),str(granularity)))
    elif market == 'KRAKEN':
        if(coin=="BTC"): coin = "XBT"
        krk_coin = '{0}USD'.format(coin)
        r = json.loads(requests.get('https://api.kraken.com/0/public/Depth?pair=%s'%(krk_coin)).content)
    elif market == 'BITSTAMP':
        btsmp_coin = '{0}USD'.format(coin).lower()
        r = json.loads(requests.get('https://www.bitstamp.net/api/v2/order_book/%s'%(btsmp_coin)).content)
    return r

# format order books data
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
                    asks.append([float(order[0])*rates['rates'][fiat], abs(order[2]*order[1])])
                else:
                    bids.append([float(order[0])*rates['rates'][fiat], abs(order[2]*order[1])])
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

# Coin descriptions
descriptions_coins = dict()
descriptions_coins['BTC'] = "Bitcoin (BTC) is a worldwide cryptocurrency and digital payment system " \
"called the first decentralized digital currency, as the system works without a central repository or single administrator. " \
"It was invented by an unknown person or group of people under the name Satoshi Nakamoto and released as open-source software in 2009. " \
"The system is peer-to-peer, and transactions take place between users directly, without an intermediary. " \
"These transactions are verified by network nodes and recorded in a public distributed ledger called a blockchain. " \
"Bitcoins are created as a reward for a process known as mining. They can be exchanged for other currencies, products, and services. " \

descriptions_coins['ETH'] = "Ethereum (ETH) is an open-source, public, blockchain-based distributed computing platform featuring smart contract (scripting) functionality. " \
"It provides a decentralized Turing-complete virtual machine, the Ethereum Virtual Machine (EVM), which can execute scripts using an international network of public nodes. " \
"Ethereum also provides a cryptocurrency token called 'ether', which can be transferred between accounts and used to compensate participant nodes for computations performed. " \
"'Gas', an internal transaction pricing mechanism, is used to mitigate spam and allocate resources on the network. " \

descriptions_coins['LTC'] = "Litecoin (LTC) is a peer-to-peer cryptocurrency and open source software project released under the MIT/X11 license. " \
"Creation and transfer of coins is based on an open source cryptographic protocol and is not managed by any central authority. " \
"While inspired by, and in most regards technically nearly identical to Bitcoin (BTC), Litecoin has some minor technical differences compared to Bitcoin and other major cryptocurrencies. " \
"Litecoin also has almost zero payment cost. " \

descriptions_coins['BCH'] = "Bitcoin Cash (BCH/BCC) is a hard fork of the cryptocurrency bitcoin. The fork occurred on August 1, 2017. " \
"Even though the fork allows for a higher block size, block generation was so sporadic that the original chain was 920 MB bigger than the chain of the fork, as of 9 August 2017. " \
"Due to the new Emergency Difficulty Adjustment (EDA) algorithm used by Bitcoin Cash, mining difficulty has fluctuated rapidly, and the most profitable chain to mine has thus switched repeatedly between Bitcoin Cash and incumbent bitcoin. " \

descriptions_coins['ETC'] = "Ethereum Classic is an open-source, public, blockchain-based distributed computing platform featuring smart contract (scripting) " \
"functionality. It provides a decentralized Turing-complete virtual machine, the Ethereum Virtual Machine (EVM), which can execute scripts using an international network of public nodes. " \
"Ethereum Classic also provides a value token called 'classic ether', which can be transferred between participants, stored in a cryptocurrency wallet and is used to compensate participant nodes for computations performed. " \
"The classic ether token is traded on cryptocurrency exchanges under the ticker symbol ETC. Gas, an internal transaction pricing mechanism, is used to prevent spam on the network and allocate resources proportionally to the incentive offered by the request. " \
"The Ethereum platform has been forked into two versions: 'Ethereum Classic' (ETC) and 'Ethereum' (ETH). Prior to the fork, the token had been called Ethereum. After the fork, the new tokens kept the name Ethereum (ETH), and the old tokens were renamed Ethereum Classic (ETC)." \

descriptions_coins['ZEC'] = "Zcash is a cryptocurrency that grew out of the Zerocoin project, aimed at improving anonymity for Bitcoin users. " \
"The Zerocoin protocol was initially improved and transformed into Zerocash, which thus yielded the Zcash cryptocurrency in 2016. " \
"Zcash payments are published on a public blockchain, but users are able to use an optional privacy feature to conceal the sender, recipient, and amount being transacted." \

descriptions_coins['XMR'] = "Monero (XMR) is an open-source cryptocurrency created in April 2014 that focuses on privacy, " \
"decentralization, and scalability. Monero uses a public ledger to record transactions while new units are created through a process called mining. " \
"Monero aims to improve on existing cryptocurrency design by obscuring sender, recipient and amount of every transaction made as well as making the mining process more egalitarian." \

descriptions_coins['XRP'] = "Ripple is a real-time gross settlement system (RTGS), currency exchange and remittance network by Ripple. " \
"Also called the Ripple Transaction Protocol (RTXP) or Ripple protocol,[3] it is built upon a distributed open source Internet protocol, " \
"consensus ledger and native cryptocurrency called XRP (ripples). " \
"Released in 2012, Ripple purports to enable 'secure, instant and nearly free global financial transactions of any size with no chargebacks.' " \
"It supports tokens representing fiat currency, cryptocurrency, commodity or any other unit of value such as frequent flier miles or mobile minutes. " \
"At its core, Ripple is based around a shared, public database or ledger, which uses a consensus process that allows for payments, exchanges and remittance in a distributed process. " \

descriptions_coins['DASH'] = "Dash (formerly known as Darkcoin and XCoin) is an open source peer-to-peer cryptocurrency that aims to be the most user-friendly " \
" and most on-chain-scalable cryptocurrency in the world. " \
"On top of Bitcoin's feature set, it currently offers instant transactions, private transactions and operates " \
"a self-governing and self-funding model that enables the Dash network to pay individuals and businesses to perform work that adds value to the network. " \
