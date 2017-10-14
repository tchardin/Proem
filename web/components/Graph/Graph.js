/**
 * Dynamic graph component with multiple areas, lines vectors.
 */
import React, {Component} from 'react'
import {
  VictoryArea,
  VictoryChart,
  VictoryStack,
  VictoryTooltip,
  VictoryZoomContainer
} from 'victory'
// import axios from 'axios'
import s from './styles.css'
import maxBy from 'lodash.maxby'
import minBy from 'lodash.minby'
import last from 'lodash.last'

class GraphComponent extends Component {

  selectArea(e) {
    this.props.onSelectArea(e)
  }

  render() {
    const {data} = this.props
    const bigChart = data.map(child => {
      return {
        date: new Date(child.date),
        price: Number(child.last)}
      })
    const chart = bigChart.slice(0, 100)
    return (
      <div className={s.container}>
        <VictoryChart
          padding={0}
          style={{
            parent: {lineHeight: 0}
          }}
          containerComponent={<VictoryZoomContainer/>}
          >
          <VictoryArea
            style={{ data: { fill: "#000" } }}
            data={chart}
            x="date"
            y="price"
            interpolation={"natural"}
            padding={0}
          />
        </VictoryChart>
      </div>
    )
  }
}

export default GraphComponent

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

 */
