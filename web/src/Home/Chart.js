/* @flow */

import React from 'react'
import {connect} from 'react-redux'

import {scaleTime} from 'd3-scale'
import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import {ChartCanvas, Chart} from 'react-stockcharts'
import {AreaSeries, LineSeries, CandlestickSeries} from 'react-stockcharts/lib/series'
import {XAxis, YAxis} from 'react-stockcharts/lib/axes'
import {
  PriceCoordinate,
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates'
import {ema} from 'react-stockcharts/lib/indicator'

import {resizeChart} from '../store/ui'

class ChartComponent extends React.Component {
  componentDidMount() {
    this.props.resizeChart()
    window.addEventListener('resize', () => this.props.resizeChart())
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.props.resizeChart())
  }

  render() {
    const {data, width, height} = this.props
    const margin = { left: 0, right: 80, top: 0, bottom: 30 }
    const xDomain = [new Date(2017, 8, 1), new Date()]
    const  calculatedData = data.map(child => {
      let newDate = child.date.split(' ')
      return {
        date: new Date(newDate[0]),
        last: Number(child.last)
      }
    })
    console.log(calculatedData)
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
            yExtents={[d => d.last]}
            padding={{top: 0, bottom: 0}}>
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
            <LineSeries yAccessor={d => d.last}
              stroke="#FFF500"
              strokeWidth={3}/>
          </Chart>
          <CrossHairCursor stroke="#FFFFFF"/>
        </ChartCanvas>
    )
  }
}

const mapStateToProps = state => {
  return {
    height: state.chartHeight,
    width: state.chartWidth - state.left,
  }
}

export default connect(mapStateToProps, {
  resizeChart
})(ChartComponent)
