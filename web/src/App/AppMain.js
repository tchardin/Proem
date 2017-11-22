/* @flow */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'

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

class AppMain extends Component {
  props: {
    chart: React.Element<*>,
  }
  state = {
    width: '100%'
  }
  componentWillReceiveProps(nextProps) {
    console.log(`AppMain: ${window.innerWidth}`)
    this.setState({
      width: `${nextProps.windowWidth - nextProps.left}px`
    })
  }
  render() {
    return (
      <Main
        size={this.state.width}>
        <AppToolbar />
        {this.props.chart &&
          React.cloneElement(this.props.chart)}
        {this.props.footer &&
          React.cloneElement(this.props.footer)}
      </Main>
    )
  }
}

const mapStateToProps = state => {
  return {
    left: state.left,
    windowWidth: state.chartWidth
  }
}

export default connect(mapStateToProps)(AppMain)
