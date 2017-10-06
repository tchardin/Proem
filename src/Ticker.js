/**
 * Ticker React component for real time feed of exchange activity
 * @flow
 */

import React from 'react'
import {
  View,
  StyleSheet,
  ScrollView
} from 'react-native'
import {TickerText} from './common/PText'

class Ticker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [
        {
          name: 'BTC-USD',
          price: 3400
        },
        {
          name: 'LTC-USD',
          price: 300
        },
        {
          name: 'ETH-USD',
          price: 200
        }
      ]
    }
  }
  componentDidMount() {


    // const ws = new WebSocket('wss://ws-feed.gdax.com')
    // ws.onopen = () => {
    //   ws.send({
    //     "type": "subscribe",
    //     "product_ids": [
    //       "BTC-USD",
    //       "LTC-USD",
    //       "ETH-USD"
    //     ],
    //     "channels": [
    //       "ticker"
    //     ]
    //   })
    // }
    // ws.onmessage = (e) => {
    //   let newMessages = this.state.messages.concat(e)
    //   this.setState({
    //     messages: newMessages
    //   })
    // }
    // ws.onerror = (e) => {
    //   console.log(e.message)
    // }
    // ws.onclose = (e) => {
    //   console.log(e.code, e.reason)
    // }
  }

  render() {
    const ticker = this.state.messages.map(e => (
      <View
        key={e.name}
        style={styles.fullContainer}>
        <View
          style={styles.topContainer}>
          <TickerText
            style={styles.textUp}>
            {e.name}
          </TickerText>
        </View>
        <View
          style={styles.bottomContainer}>
          <TickerText
            style={styles.textDown}>
            {e.price}
          </TickerText>
        </View>
      </View>
    ))
    // let tape = messages.map(e => (
    //   <TickerText
    //     style={styles.text}>
    //     e.name
    //   </
    // ))
    return (
      <View
        style={styles.container}>
        {ticker}
      </View>
    )
  }
}

export default Ticker

const styles = StyleSheet.create({
  container: {
    height: 80,
    // position: 'absolute',
    // bottom: 0,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  fullContainer: {
    flexDirection: 'row'
  },
  topContainer: {
    alignSelf: 'flex-start',
    padding: 16
  },
  bottomContainer: {
    alignSelf: 'flex-end',
    padding: 16
  },
  textUp: {

  },
  textDown: {

  }
})
