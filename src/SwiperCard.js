/**
 * Reusable currency card components
 * @flow
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Graph from './Graph'

export default class SwiperCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }
  roundPrice(price) {
    return Number(Math.round(price +'e'+ 2)+'e-' + 2)
  }
  componentDidMount() {
    const {coin} = this.props
    fetch(`https://api.gdax.com/products/${coin}/ticker`)
    .then(response => response.json())
    .then(data => this.setState({
      isLoading: false,
      id: coin,
      price: data.price
    }))
    .catch(error => console.log('Error, make it do something...' + error))
  }
  render() {
    if (this.state.isLoading) {
      return (
        <LinearGradient
          colors={['#9DD6EB', '#92BBD9']}
          style={styles.container}>
          <ActivityIndicator
            color="white"
            size="large"
            />
        </LinearGradient>
      )
    }
    return (
      <LinearGradient
        colors={['#9DD6EB', '#92BBD9']}
        style={styles.container}>
        <Text style={styles.text}>{this.state.id}</Text>
        <Text style={styles.text}>{this.roundPrice(this.state.price)}</Text>
        <Graph />
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
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
