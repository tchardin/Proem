/**
 * Smart container to display a Chart component
 *
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Chart from './Chart'

import {fetchHistory} from '../store/history'
import {fetchCandles} from '../store/candles'

class ChartContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: 450,
      height: 300
    }
    this.windowDimensions = this.windowDimensions.bind(this)
    this.getViewData = this.getViewData.bind(this)
  }
  windowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight - 100
    })
  }
  getViewData() {
    const {ui, history, candles, crypto, fiat} = this.props
    if (ui.chart === 'LINE') {
      if (typeof history[crypto] === 'undefined' || typeof history[crypto][fiat] === 'undefined') {
        this.props.dispatch(fetchHistory(crypto, fiat))
      }
    } else if (ui.chart === 'CANDLES') {
      if (typeof candles[crypto] === 'undefined' || typeof candles[crypto][fiat] === 'undefined') {
        this.props.dispatch(fetchCandles(crypto, fiat))
      }
    }
  }
  componentDidMount() {
    this.windowDimensions()
    window.addEventListener('resize', this.windowDimensions)
    this.getViewData()
  }
  componentDidUpdate() {
    this.getViewData()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.windowDimensions)
  }
  render() {
    const {history, crypto, fiat, ui, candles, alerts} = this.props
    const {width, height} = this.state
    let data
    if (ui.chart === 'LINE') {
      if (typeof history[crypto] === 'undefined' || typeof history[crypto][fiat] === 'undefined' || history[crypto][fiat].isFetching) {
        return null
      }
      data = history[crypto][fiat].items.map(child => {
        return {
          date: new Date(child.date),
          close: Number(child.last)
          }
        })
    } else if (ui.chart === 'CANDLES') {
      if (typeof candles[crypto] === 'undefined' || typeof candles[crypto][fiat] === 'undefined' || candles[crypto][fiat].isFetching) {
        return null
      }
      data = candles[crypto][fiat].items.map(child => {
        return {
          date: new Date(child.Date),
          close: Number(child.Close),
          open: Number(child.Open),
          high: Number(child.High),
          low: Number(child.Low)
          }
        })
      data = data.reverse()
    }
    return (
      <div>
        <Chart
          height={height}
          width={width}
          data={data}
          view={ui}
          alerts={alerts}
          />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {candles, history, ids, ui, alerts} = state
  const {selectedCrypto, selectedFiat} = ids
  return {
    alerts,
    ui,
    candles,
    history,
    crypto: selectedCrypto,
    fiat: selectedFiat
  }
}

export default connect(mapStateToProps)(ChartContainer)
