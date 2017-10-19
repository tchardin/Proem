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
import {AreaSeries, LineSeries} from 'react-stockcharts/lib/series'
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
import {
  getHistory,
  getSelectedHistory,
  getSelectedFiat,
  getSelectedCrypto,
  fetchHistory
} from '../../market/history'

class ChartComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: 450,
      height: 300
    }
    this.windowDimensions = this.windowDimensions.bind(this)
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
    const {history, crypto, fiat } = this.props
    const {width, height} = this.state
    if (typeof history[crypto] === 'undefined' || typeof history[crypto][fiat] === 'undefined' || history[crypto][fiat].isFetching) {
      return null
    }
    const data = history[crypto][fiat].items.map(child => {
      return {
        volume: Number(child.volume),
        last: Number(child.last),
        date: new Date(child.date),
        }
      })
    const margin = { left: 0, right: 50, top: 0, bottom: 30 }
    const gridHeight = height - margin.top - margin.bottom
    const xGrid = {innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1}
    const xDomain = [new Date(2016, 10, 1), new Date()]
    const yDomain = [minBy(data, d => d.last).price, maxBy(data, d => d.last).last+(maxBy(data, d => d.last).last/4)]
    return (
      <ChartCanvas ratio={1} width={width} height={height}
					margin={margin}
					seriesName="MSFT"
					data={data} type="svg"
					xAccessor={d => d.date}
					xScale={scaleTime()}
					xExtents={xDomain}>
				<Chart id={0} yExtents={d => d.last}>
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
  					displayFormat={timeFormat("%Y-%m-%d")} />
          <MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					<LineSeries yAccessor={d => d.last}
            stroke="#FFF500"
            strokeWidth={2}/>
				</Chart>
        <CrossHairCursor stroke="#FFFFFF"/>
			</ChartCanvas>
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

export default connect(mapStateToProps)(ChartComponent)
