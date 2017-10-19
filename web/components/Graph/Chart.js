/**
 * New chart component with react-stockcharts library
 *
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'

import {scaleTime} from 'd3-scale'
import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import {ChartCanvas, Chart} from 'react-stockcharts'
import {AreaSeries, LineSeries, CandlestickSeries} from 'react-stockcharts/lib/series'
import {XAxis, YAxis} from 'react-stockcharts/lib/axes'
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates'
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'

import maxBy from 'lodash.maxby'
import minBy from 'lodash.minby'
import last from 'lodash.last'

const candlesAppearance = {
  wickStroke: d => d.close > d.open ? "#0AFE00" : "#FF0000",
  fill: function fill(d) {
    return d.close > d.open ? "#0AFE00" : "#FF0000";
  },
  stroke: "#000000",
  candleStrokeWidth: 0,
  widthRatio: 0.8,
  opacity: 1,
}

class ChartComponent extends Component {
  render() {
    const {height, width, data, view} = this.props
    const margin = { left: 0, right: 50, top: 0, bottom: 30 }
    const gridHeight = height - margin.top - margin.bottom
    const xGrid = {innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1}
    const xDomain = [new Date(2017, 8, 1), new Date()]
    // const yDomain = [minBy(data, d => d.last).price, maxBy(data, d => d.last).last+(maxBy(data, d => d.last).last/4)]
    const yExtents = view === 'HISTORY' ? (d => d.close) : (d => [d.high, d.low])
    return (
      <ChartCanvas ratio={1} width={width} height={height}
					margin={margin}
					seriesName="MSFT"
					data={data} type="svg"
					xAccessor={d => d.date}
					xScale={scaleTime()}
					xExtents={xDomain}>
				<Chart id={0} yExtents={yExtents}>
					<XAxis
            axisAt="bottom"
            orient="bottom"
            ticks={6}
            opacity={0}
            tickStroke="#FFFFFF"
            tickStrokeOpacity={0.4}/>
					<YAxis
            axisAt="right"
            orient="right"
            opacity={0}
            ticks={8}
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
					{view === 'HISTORY' &&
          <LineSeries yAccessor={d => d.close}
            stroke="#FFF500"
            strokeWidth={2}/>}
          {view === 'CANDLES' &&
          <CandlestickSeries {...candlesAppearance}/>}
				</Chart>
        <CrossHairCursor stroke="#FFFFFF"/>
			</ChartCanvas>
    )
  }
}

export default ChartComponent
