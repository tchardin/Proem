/* @flow */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import styled, {keyframes} from 'styled-components'
import {resizeChart} from '../store/ui'
import AppToolbar from './AppToolbar'

const Main = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transition: all .12s ease;
  background-color: black;
  height: 100vh;
  width: ${props => props.size};
`
const Relative = styled.div`
  position: relative;
`

const EmptyChart = styled.div`
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  display: inline-block;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const BallContainer = styled.div`
  margin-top: 20%;
`

const Ball1 = styled.div`
  background-color: #000;
  border:10px solid #fff;
  opacity:.9;
  border-top:10px solid #000;
  border-left:10px solid #000;
  border-radius:100px;
  width: 100px;
  height: 100px;
  margin:0 auto;
  animation: ${rotate360} .5s infinite linear;
`

const Ball2 = styled.div`
  background-color: #000;
  border:10px solid #fff;
  opacity:.9;
  border-top:10px solid #000;
  border-left:10px solid #000;
  border-radius:100px;
  width:60px;
  height:60px;
  margin:0 auto;
  position:relative;
  top:-100px;
  animation: ${rotate360} .45s infinite linear;
`


class AppMain extends Component {
  props: {
    chart: React.Element<*>,
    footer: React.Element<*>
  }
  state = {
    width: '100%'
  }
  componentDidMount() {
    this.props.resizeChart()
    window.addEventListener('resize', () => this.props.resizeChart())
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.props.resizeChart())
  }
  componentWillReceiveProps(nextProps) {
    console.log(`AppMain: ${window.innerWidth}`)
    this.setState({
      width: `${nextProps.windowWidth - nextProps.left}px`
    })
  }
  render() {
    console.log('AppMain renders')
    return (
      <Main
        size={this.state.width}>
        <Relative>
          <AppToolbar />
          {this.props.chart ? React.cloneElement(this.props.chart) : (
                <EmptyChart
                  width={this.props.width}
                  height={this.props.height}>
                    <BallContainer>
                      <Ball1 />
                      <Ball2 />
                    </BallContainer>
                </EmptyChart>)
            }
          {this.props.footer &&
            React.cloneElement(this.props.footer, {
              closed: this.props.left === 0
            })}
        </Relative>
      </Main>
    )
  }
}

const mapStateToProps = state => {
  return {
    left: state.ui.left,
    windowWidth: state.ui.chartWidth,
    height: state.ui.chartHeight,
    width: state.ui.chartWidth - state.ui.left,
  }
}

export default connect(mapStateToProps, {
  resizeChart
})(AppMain)
