/**
 * Smart container to display a Chart component
 *
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Chart from './Chart'

import {fetchHistory} from '../store/history'
import {fetchCandles} from '../store/candles'
import {fetchPChart} from '../store/portfolio'

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
      height: window.innerHeight - 120
    })
  }
  getViewData() {

    const {
      ui,
      history,
      candles,
      crypto,
      fiat,
      portfolio,
      group,
      fetchHistory,
      fetchCandles
    } = this.props

    if (ui.portfolio) {
      if (group.length && typeof portfolio.charts[group[0]][fiat] === 'undefined') {
        group.forEach(id => fetchPChart(id))
      }
    } else {
      if (ui.chart === 'LINE') {
        if (typeof history[crypto] === 'undefined' || typeof history[crypto][fiat] === 'undefined') {
          fetchHistory(crypto, fiat)
        }
      } else if (ui.chart === 'CANDLES') {
        if (typeof candles[crypto] === 'undefined' || typeof candles[crypto][fiat] === 'undefined') {
          fetchCandles(crypto, fiat)
        }
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
    const {
      history,
      crypto,
      fiat,
      group,
      ui,
      candles,
      alerts,
      portfolio
    } = this.props
    const {width, height} = this.state
    let data
    if (ui.portfolio) {
      if (portfolio.allIds.length && portfolio.allIds.length > 1 && portfolio.charts[portfolio.allIds[portfolio.allIds.length-1]][fiat].isFetching === false) {
        let oldestAsset = portfolio.allIds.reduce((a, b) => {
          return portfolio.charts[a][fiat].chart.length > portfolio.charts[b][fiat].chart.length ? a : b
        })
        data = portfolio.charts[oldestAsset][fiat].chart.map(a => {
          let point = {}
          let total = 0
          portfolio.allIds.forEach(id => {
            portfolio.charts[id][fiat].chart.forEach(c => {
              if (c.date === a.date) {
                return point[id] = c.price
              }
            })
          })
          for (const prop in point) {
            total += point[prop]
          }
          return {
            date: new Date(a.date),
            ...point,
            total
          }
        })
        console.log(data)
      } else if (portfolio.allIds.length && !portfolio.charts[portfolio.allIds[0]][fiat].isFetching) {
        data = portfolio.charts[portfolio.allIds[0]][fiat].chart.map(a => {
          return {
            date: new Date(a.date),
            [portfolio.allIds[0]]: a.price,
            total: a.price
          }
        })
      } else {
        return null
      }
    } else {
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
          let trim = child.Date.split(' ')
          return {
            date: new Date(trim[0]),
            close: Number(child.Close),
            open: Number(child.Open),
            high: Number(child.High),
            low: Number(child.Low)
            }
          })
        data = data.reverse()
      }
    }
    return (
      <div>
        <Chart
          height={height}
          width={width}
          data={data}
          view={ui}
          alerts={alerts}
          group={group}
          pfIds={portfolio.allIds}
          />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {candles, history, ids, ui, alerts, portfolio} = state
  const {selectedCrypto, selectedFiat, selectedGroup} = ids
  return {
    alerts,
    ui,
    candles,
    history,
    portfolio,
    crypto: selectedCrypto,
    fiat: selectedFiat,
    group: selectedGroup
  }
}

export default connect(mapStateToProps, {
  fetchHistory,
  fetchCandles,
  fetchPChart
})(ChartContainer)
