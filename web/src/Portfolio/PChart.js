import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'

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

import {resizeChart} from '../store/ui'

const colorScale = ["#FFF500", "#FF00C4", "#FFA700", "#0089FF", "#B100FF"]

const EmptyChart = styled.div`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  display: inline-block;
`

class PChartComponent extends React.Component {
  componentDidMount() {
    this.props.resizeChart()
    window.addEventListener('resize', () => this.props.resizeChart())
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.props.resizeChart())
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
    if (!pfIds.length || data[0].values.length <= 1) {
      return (
        <EmptyChart
          width={width}
          height={height}>
        </EmptyChart>
      )
    }
    // if (pfIds.length > 1) {
      let firstAsset = data.reduce((a, b) => {
        return a.values.length > b.values.length ? a : b
      }, data[0])

    const calculatedData = firstAsset.values.map(a => {
        let point = {}
        let total = 0
        data.forEach(d => {
          let balance = 0
          d.values.forEach(v => {
            assets[d.coin].transactions.forEach(t => {
              if (moment(t.date).format('YYYY-MM-DD') === v.date) {
                balance += Number(t.amount)
              }
            })
            if (v.date === a.date) {
              return point[d.coin] = Number(v.last)*balance
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

    console.log(calculatedData)
    // } else {
    //   calculatedData = data[0].values.map(a => ({
    //     date: new Date(a.date),
    //     [data[0].coin]: a.last,
    //     total: a.last
    //   }))
    // }
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

export default connect(mapStateToProps, {
  resizeChart
})(PChartComponent)
