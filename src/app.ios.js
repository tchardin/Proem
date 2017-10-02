import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native'
// import LinearGradient from 'react-native-linear-gradient'
// import Swiper from 'react-native-swiper'
// import SwiperCard from './SwiperCard'
import PButton from './common/PButton'

export default class Proem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currencies: ['BTC-USD', 'ETH-USD', 'LTC-USD']
    }
  }
  render() {
    // const {currencies} = this.state
    // let cards = currencies.map(id => (
    //   <SwiperCard
    //     key={id}
    //     coin={id}
    //   />
    // ))
    return (
    //   <Swiper
    //     style={styles.wrapper}
    //     loop={false}>
    //     {cards}
    //  </Swiper>
    <View
      style={styles.container}>
      <PButton
        caption="Manage Asset"
        onPress={() => {}}
        />
    </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#9DD6EB',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})
