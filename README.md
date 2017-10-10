# Proem

See TODOs and work in progress explained in ./web/pages/home/index.js

Please think about cleaning some of the code as you go otherwise gonna be a nightmare as the codebase grows. (e.g. do we still need that bitfinex.db file or what is the package-lock etc...)

App is iOS focused although could be made Android ready pretty fast when iOS development is ready.

## Status

Testing Swiper cards for different currencies, graph libraries and cool gradients.
Using APIs from different exchanges to get the latest quotes. We will need to integrate as many exchanges as possibles to get a global ideas of prices in multiple currencies. Starting a table of supported exchanges we can update as we go.

## Design

See .xd file for reference.

## Supported exchange APIs

|  | GDAX | Bitfinex | Bithump | bitFlyer | Bitrex | HitBTC | Bitstamp | Gemini | Poloniex | Kraken | Korbit | Binance | Coinone | OkCoin | BTCC | Huobi |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| BTC | BTC-USD | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| ETH | ETH-USD | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| LTC | LTC-USD | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| BCH | NA | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| ETC | NA | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| ZEC | NA | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| DASH | NA | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| XMR | NA | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |

## Running

Clone the project, npm install and run the Xcode file in the ios folder. You might need to change some xcode certificate settings. Instructions appear in the logs.

Uses React Native cli.
