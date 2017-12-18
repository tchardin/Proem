import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import isEqual from 'lodash/isEqual'

import {scaleTime} from 'd3-scale'
import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import moment from 'moment'

import {ChartCanvas, Chart} from 'react-stockcharts'
import {
  AreaSeries,
  LineSeries,
} from 'react-stockcharts/lib/series'
import {XAxis, YAxis} from 'react-stockcharts/lib/axes'
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates'

const colorScale = ["#FFF500", "#FF00C4", "#FFA700", "#0089FF", "#B100FF"]

const EmptyChart = styled.div`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  display: inline-block;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

class PChartComponent extends React.Component {
  /* state = {
    data: []
  }
  computePfData = (nextProps) => {
    let t0 = performance.now()
    const {data, assets, pfIds} = nextProps
    if (pfIds.length) {
      // Find the longest array
      let firstAsset = data.reduce((a, b) => {
        return a.values.length > b.values.length ? a : b
      }, data[0])
      let t1 = performance.now()
      console.log(`Reduce operation time:  ${t1-t0}`)

      const calculatedData = firstAsset.values.map(a => {
          let point = {}
          let total = 0
          // Looping through the different coins in the portfolio
        for (let i=0, n=data.length; i<n; i++) {
            let balance = 0
            // Looping through the historical values
            for (let j=0, o=data[i].values.length; j<o; j++) {
              let val = data[i].values[j]
              // Looping through the transactions in the portfolio
              for (let k=0, p=assets[data[i].coin].transactions.length; k<p; k++) {
                let tx = assets[data[i].coin].transactions[k]
                // Checking if there's a transaction corresponding to the historical value
                if (moment(tx.date).format('YYYY-MM-DD') === val.date) {
                  balance += Number(tx.amount)
                }
              }
              if (val.date === a.date) {
                point[data[i].coin] = Number(val.last)*balance
              }
            }
          }
          for (const prop in point) {
            total += point[prop]
          }
          return {
            date: new Date(a.date),
            ...point,
            total
          }
        })
        let t2 = performance.now()
        console.log(`Operation time: ${t2-t1}`)
        this.setState({
          data: calculatedData
        })
    } else {
      this.setState({
        data: []
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.data, nextProps.data)) {
      this.computePfData(nextProps)
    }
  }
  componentDidMount() {
    this.computePfData(this.props)
  } */
  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(this.props.data, nextProps.data) ||
      this.props.selectedIds !== nextProps.selectedIds ||
      this.props.width !== nextProps.width
    )
  }

  render() {
    const {
      data,
      width,
      height,
      pfIds,
      selectedIds,
      assets
    } = this.props
    console.log('PChart rendered')
    // const calculatedData = this.state.data
    if (!pfIds.length || data[0].values.length <= 1 /* || !calculatedData.length */) {
      console.log('Render ball')
      return (
        <EmptyChart
          width={width}
          height={height}>
        </EmptyChart>
      )
    }

    let t0 = performance.now()
    // const {data, assets, pfIds} = nextProps
    //if (pfIds.length) {
      // Find the longest array
      let firstAsset = data.reduce((a, b) => {
        return a.values.length > b.values.length ? a : b
      }, data[0])
      let t1 = performance.now()
      console.log(`Reduce operation time:  ${t1-t0}`)

      const calculatedData = firstAsset.values.map(a => {
          let point = {}
          let total = 0
          // Looping through the different coins in the portfolio
        for (let i=0, n=data.length; i<n; i++) {
            let balance = 0
            // Looping through the historical values
            for (let j=0, o=data[i].values.length; j<o; j++) {
              let val = data[i].values[j]
              // Looping through the transactions in the portfolio
              for (let k=0, p=assets[data[i].coin].transactions.length; k<p; k++) {
                let tx = assets[data[i].coin].transactions[k]
                // Checking if there's a transaction corresponding to the historical value
                if (moment(tx.date).format('YYYY-MM-DD') === val.date) {
                  balance += Number(tx.amount)
                }
              }
              if (val.date === a.date) {
                point[data[i].coin] = Number(val.last)*balance
              }
            }
          }
          for (const prop in point) {
            total += point[prop]
          }
          return {
            date: new Date(a.date),
            ...point,
            total
          }
        })
        let t2 = performance.now()
        console.log(`Operation time: ${t2-t1}`)
        console.log(calculatedData)

    const margin = { left: 20, right: 80, top: 0, bottom: 30 }
    const xDomain = [new Date(2017, 9, 1), new Date()]
    let groupLines = selectedIds.map((id, index) => (
       <LineSeries
         key={id}
         yAccessor={d => d[id]}
         stroke={colorScale[pfIds.indexOf(id)]}
         strokeWidth={3}/>
     ))
      // const groupExtents = selectedIds.map(id => {
      //   return d => d[id]
      // })
      const yExtents = [d => d.total, d => (d.total-d.total)]
      return (
        <ChartCanvas ratio={1} width={width} height={height}
            margin={margin}
            seriesName="MSFT"
            data={calculatedData} type="svg"
            xAccessor={d => d.date}
            xScale={scaleTime()}
            xExtents={xDomain}>
          <Chart
            id={0}
            yExtents={yExtents}
            padding={{top: 140, bottom: 0}}>
            <XAxis
              axisAt="bottom"
              orient="bottom"
              ticks={6}
              opacity={0}
              fontFamily="Gotham"
              tickStroke="#FFFFFF"
              tickStrokeOpacity={0.4}/>
            <YAxis
              axisAt="right"
              orient="right"
              opacity={0}
              ticks={8}
              fontFamily="Gotham"
              tickStroke="#FFFFFF"
              tickStrokeOpacity={0.4}
              innerTickSize={5}
              outerTickSize={5}
              inverted={true}/>
            <MouseCoordinateX
              at="bottom"
              orient="bottom"
              displayFormat={timeFormat("%Y-%m-%d")}
              fill="#00CEFF"
              fontFamily="Gotham"
              fontSize={11}/>
            <MouseCoordinateY
              at="right"
              orient="right"
              displayFormat={format(".2f")}
              fill="#00CEFF"
              fontFamily="Gotham"
              fontSize={11}/>
            <AreaSeries
              yAccessor={d => d.total}
              strokeWidth={0}
              fill="#25286E"
              opacity={1}/>
              {groupLines}
          </Chart>
          <CrossHairCursor stroke="#FFFFFF"/>
        </ChartCanvas>
      )
  }
}

const mapStateToProps = state => ({
  height: state.ui.chartHeight,
  width: state.ui.chartWidth - state.ui.left,
  pfIds: state.routing.variables.group,
  pfStart: state.routing.variables.date,
  selectedIds: state.ui.selectedGroup,
  assets: state.portfolio.assets
})

export default connect(mapStateToProps)(PChartComponent)
