/**
 * Dynamic graph component with multiple areas, lines vectors.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  VictoryArea,
  VictoryLine,
  VictoryChart,
  VictoryStack,
  VictoryTooltip,
  VictoryVoronoiTooltip,
  VictoryZoomContainer,
  VictoryAxis
} from 'victory'
// import axios from 'axios'
import s from './styles.css'
import maxBy from 'lodash.maxby'
import minBy from 'lodash.minby'
import last from 'lodash.last'
import {
  getHistory,
  getSelectedHistory,
  getSelectedFiat,
  getSelectedCrypto,
  fetchHistory
} from '../../market/history'

class GraphComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: 450,
      height: 300
    }
    this.windowDimensions = this.windowDimensions.bind(this)
  }
  selectArea(e) {
    this.props.onSelectArea(e)
  }

  windowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight - 100
    })
  }

  componentDidMount() {
    this.windowDimensions()
    window.addEventListener('resize', this.windowDimensions)
    const {crypto, fiat} = this.props
    this.props.dispatch(fetchHistory(crypto, fiat))
  }

  componentDidUpdate() {
    const {history, crypto, fiat} = this.props
    console.log('Component updated')
    if (typeof history[crypto] === 'undefined' || typeof history[crypto][fiat] === 'undefined') {
      this.props.dispatch(fetchHistory(crypto, fiat))
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowDimensions)
  }

  render() {
    const {history, crypto, fiat} = this.props
    if (typeof history[crypto] === 'undefined' || typeof history[crypto][fiat] === 'undefined' || history[crypto][fiat].isFetching) {
      return null
    }
    const bigChart = history[crypto][fiat].items.map(child => {
      return {
        date: new Date(child.date),
        price: Number(child.last)}
      })
    const chart = bigChart.slice(0, bigChart.length-1)
    const xDomain = [new Date(2016, 10, 1), new Date()]
    const yDomain = [minBy(chart, d => d.price).price, maxBy(chart, d => d.price).price+(maxBy(chart, d => d.price).price/4)]
    return (
      <div className={s.container}>
        <VictoryChart
          padding={0}
          style={{
            parent: {lineHeight: 0}
          }}
          height={this.state.height}
          width={this.state.width}
          scale={{x: "time"}}
          containerComponent={<VictoryZoomContainer
            zoomDimension="x"
            />}
          >
          <VictoryLine
            style={{ data: { stroke: "#FFF500", strokeWidth: 2 } }}
            data={chart}
            domain={{
              x: xDomain,
              y: yDomain
            }}
            x="date"
            y="price"
            interpolation={"basis"}
            padding={0}
            />
        </VictoryChart>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    history: getHistory(state),
    crypto: getSelectedCrypto(state),
    fiat: getSelectedFiat(state)
  }
}

export default connect(mapStateToProps)(GraphComponent)

/**
 * Putting here some tutorial code from Victory, needs to be adapted a bit
 * https://formidable.com/open-source/victory/guides/zoom-large-data#basic-scenario-time-series-data
 *

 constructor(props) {
   super(props)
   this.entireDomain =this.getEntireDomain(props)
   this.state = {
     zoomedXDomain: this.entireDomain.x
   }
   this.selectArea = this.selectArea.bind(this)
 }

 onDomainChange(domain) {
   this.setState({
     zoomedXDomain: domain.x
   })
 }

 getData() {
   const { zoomedXDomain } = this.state
   const { data, maxPoints } = this.props
   const bigChart = data.map(child => {
     return {
       date: new Date(child.date),
       price: Number(child.last)}
     })
   const chart = bigChart.slice(0, 100)
   const filtered = chart.filter(
     // is d "between" the ends of the visible x-domain?
     (d) => (d.date >= zoomedXDomain[0] && d.date <= zoomedXDomain[1]))
   // if (filtered.length > maxPoints) {
   //   const k = Math.ceil(filtered.length/maxPoints)
   //   return filtered.filter(
   //     (d, i) => ((i % k) === 0)
   //   )
   // }
   return filtered
 }

 getEntireDomain(props) {
   const { data } = props
   const bigChart = data.map(child => {
     return {
       date: new Date(child.date),
       price: Number(child.last)}
     })
     const chart = bigChart.slice(0, 100)
     return {
     y: [minBy(chart, d => d.price).price, maxBy(chart, d => d.price).price],
     x: [ chart[0].date, last(chart).date]
   }
 }

 <VictoryAxis
   domain={xDomain}
   scale="time"
   standalone={false}
   offsetX={-50}
   style={{
     grid: {stroke: "#95989A", strokeWidth: 1},
     axis: {stroke: "#95989A", strokeWidth: 1},
     ticks: {
       size: 5,
       stroke: "#95989A",
       strokeWidth: 1
     },
     tickLabels: {
       fill: "#95989A",
       fontFamily: "Gotham",
       fontSize: 16
     }
   }}
   />
 <VictoryAxis dependentAxis
   domain={yDomain}
   offsetX={50}
   orientation="right"
   standalone={false}
   style={{axis: {stroke: "#95989A", strokeWidth: 1},
     ticks: {
       size: 5,
       stroke: "#95989A",
       strokeWidth: 1
     },
     tickLabels: {
       fill: "#95989A",
       fontFamily: "Gotham",
       fontSize: 16
     }
   }}
   />

 */
