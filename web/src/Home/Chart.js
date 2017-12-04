/* @flow */

import React from 'react'
import {connect} from 'react-redux'

import {scaleTime} from 'd3-scale'
import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import {ChartCanvas, Chart} from 'react-stockcharts'
import {
  LineSeries,
  CandlestickSeries,
  BollingerSeries,
} from 'react-stockcharts/lib/series'
import {XAxis, YAxis} from 'react-stockcharts/lib/axes'
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates'
import {ema, sma, bollingerBand} from 'react-stockcharts/lib/indicator'

import {resizeChart} from '../store/ui'

const bbStroke = {
  top: "#B100FF",
	middle: "#000000",
	bottom: "#B100FF",
}

const candlesAppearance = {
  wickStroke: d => d.close > d.open ? "#0AFE00" : "#FF0000",
  fill: d => d.close > d.open ? "#0AFE00" : "#FF0000",
  stroke: "#000000",
  candleStrokeWidth: 0,
  widthRatio: 0.8,
  opacity: 1,
}

class ChartComponent extends React.Component {
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
      view,
      width,
      height,
      emaLines,
      smaLines,
      bbLines
    } = this.props
    const ema10 = ema()
      .merge((d, c) => {d.ema10 = c})
      .accessor(d => d.ema10)
      .stroke('#FF00C4')
    const ema50 = ema()
  		.options({ windowSize: 50 })
  		.merge((d, c) => {d.ema50 = c})
  		.accessor(d => d.ema50)
      .stroke('#FFA700')
    const sma20 = sma()
			.options({ windowSize: 20 })
			.merge((d, c) => {d.sma20 = c})
			.accessor(d => d.sma20)
      .stroke('#ff0000')
    const bb = bollingerBand()
  		.merge((d, c) => {d.bb = c;})
  		.accessor(d => d.bb)

    const bbFill = "#4682B4"

    const margin = { left: 20, right: 80, top: 0, bottom: 30 }
    const xDomain = [new Date(2017, 9, 1), new Date()]

    let formattedData
    if (view === 'HISTORY') {
      formattedData = data.map(child => {
        let newDate = child.date.split(' ')
        return {
          date: new Date(newDate[0]),
          close: Number(child.last)
        }
      })
    } else {
      formattedData = data.map(child => {
        let newDate = child.date.split(' ')
        return {
          date: new Date(newDate[0]),
          open: Number(child.open),
          close: Number(child.close),
          high: Number(child.high),
          low: Number(child.low),
        }
      })
    }
    const calculatedData = ema10(sma20(ema50(bb(formattedData))))

    const yExtents = []
    if (view === 'HISTORY') {
      yExtents.push(d => d.close)
    } else if (view === 'CANDLES') {
      yExtents.push(d => [d.high, d.low])
    }
    if (emaLines) {
      yExtents.push(ema10.accessor())
      yExtents.push(ema50.accessor())
    }
    if (smaLines) {
      yExtents.push(sma20.accessor())
    }
    if (bbLines) {
      yExtents.push(bb.accessor())
    }
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
            padding={{top: 90, bottom: 0}}>
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
            {view === 'HISTORY' &&
            <LineSeries yAccessor={d => d.close}
              stroke="#FFF500"
              strokeWidth={3}/>}
            {view === 'CANDLES' &&
              <CandlestickSeries {...candlesAppearance}/>}
              {bbLines && <BollingerSeries yAccessor={d => d.bb}
  						        stroke={bbStroke}
  						        fill={bbFill} />}
            {emaLines && <LineSeries
                yAccessor={ema10.accessor()}
                stroke={ema10.stroke()}/>}
            {emaLines && <LineSeries
                yAccessor={ema50.accessor()}
                stroke={ema50.stroke()}/>}
            {smaLines && <LineSeries
                    yAccessor={sma20.accessor()}
                    stroke={sma20.stroke()}/>}
          </Chart>
          <CrossHairCursor stroke="#FFFFFF"/>
        </ChartCanvas>
    )
  }
}

const mapStateToProps = state => {
  return {
    height: state.ui.chartHeight,
    width: state.ui.chartWidth - state.ui.left,
    emaLines: state.ui.ema,
    smaLines: state.ui.sma,
    bbLines: state.ui.bol,
  }
}

export default connect(mapStateToProps, {
  resizeChart
})(ChartComponent)
