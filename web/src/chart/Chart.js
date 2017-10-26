/**
 * New chart component with react-stockcharts library
 *
 */

import React from 'react'

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

const candlesAppearance = {
  wickStroke: d => d.close > d.open ? "#0AFE00" : "#FF0000",
  fill: d => d.close > d.open ? "#0AFE00" : "#FF0000",
  stroke: "#000000",
  candleStrokeWidth: 0,
  widthRatio: 0.8,
  opacity: 1,
}

const alertsLineStyle = {
  fill: "none",
  lineStroke: "#FFFFFF",
  fontFamily: "Gotham",
  textFill: "#0AFE00"
}

const ChartComponent = ({height, width, data, view, alerts}) => {
    const {allIds, alertsByID} = alerts
    let alertLines = allIds.length ? allIds.map(id => (
      <PriceCoordinate
        key={id}
        at="right"
        orient="left"
        price={Number(alertsByID[id].price)}
        displayFormat={format('.2f')}
        {...alertsLineStyle}/>
    )) : null
    const ema10 = ema()
      .merge((d, c) => {d.ema10 = c})
      .accessor(d => d.ema10)
      .stroke('#FF00C4')
    const ema50 = ema()
  		.options({ windowSize: 50 })
  		.merge((d, c) => {d.ema50 = c})
  		.accessor(d => d.ema50)
      .stroke('#FFA700')
    const margin = { left: 0, right: 50, top: 0, bottom: 30 }
    const gridHeight = height - margin.top - margin.bottom
    const xGrid = {innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1}
    const xDomain = [new Date(2017, 8, 1), new Date()]
    // const yDomain = [minBy(data, d => d.last).price, maxBy(data, d => d.last).last+(maxBy(data, d => d.last).last/4)]
    const calculatedData = ema10(ema50(data))
    const yExtents = view.chart === 'LINE' ? ([d => d.close, ema10.accessor(), ema50.accessor()]) : ([d => [d.high, d.low], ema10.accessor(), ema50.accessor()])
    return (
      <ChartCanvas ratio={1} width={width} height={height}
					margin={margin}
					seriesName="MSFT"
					data={calculatedData} type="svg"
					xAccessor={d => d.date}
					xScale={scaleTime()}
					xExtents={xDomain}>
				<Chart id={0} yExtents={yExtents}>
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
					{view.chart === 'LINE' &&
          <LineSeries yAccessor={d => d.close}
            stroke="#FFF500"
            strokeWidth={2}/>}
          {view.chart === 'CANDLES' &&
          <CandlestickSeries {...candlesAppearance}/>}
          {view.alerts && alertLines}
          <LineSeries yAccessor={ema10.accessor()} stroke={ema10.stroke()}/>
          <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()}/>
				</Chart>
        <CrossHairCursor stroke="#FFFFFF"/>
			</ChartCanvas>
    )
}

export default ChartComponent
