/**
 * React Static Boilerplate
 * Copyright (c) 2015-present Kriasoft. All rights reserved.
 */

/* @flow */

import React from 'react';
import styled from 'styled-components';

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

import Link from '../Link';

const Container = styled.div`
padding: 1em 1em 2em;
`

const Title = styled.h2`
  font-family: 'Gotham', sans-serif;
  font-weight: bold;
  font-size: 3em;
`

const Description = styled.p`
  font-family: 'Gotham', sans-serif;
  font-size: 3em;
`

const Button = styled(Link)`
  display: inline-block;
  padding: 0.5em 2em;
  margin-top: 1em;
  font-family: 'Roboto', sans-serif;
  color: #333;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  background-color: #fff;
  border-radius: 2px;

  &:active,
  &:hover,
  &:visited {
    color: #333;
  }
`;

class Hero extends React.Component {
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
      height: window.innerHeight
    })
  }

  componentDidMount() {
    this.windowDimensions()
    window.addEventListener('resize', this.windowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowDimensions)
  }

  render() {
    const {width, height} = this.state
    const {data} = this.props
    const margin = { left: 0, right: 80, top: 0, bottom: 30 }
    const xDomain = [new Date(2017, 8, 1), new Date()]
    const  calculatedData = data.map(d => {
      return {
        date: new Date(child.date),
        close: Number(child.last)
      }
    })
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
            yExtents={[d => d.close]}
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
            <LineSeries yAccessor={d => d.close}
              stroke="#FFF500"
              strokeWidth={3}/>
          </Chart>
          <CrossHairCursor stroke="#FFFFFF"/>
        </ChartCanvas>
    )
  }
}

export default Hero;
