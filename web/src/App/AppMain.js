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
const Relative = styled.div`
  position: relative;
`

class AppMain extends Component {
  props: {
    chart: React.Element<*>,
    footer: React.Element<*>
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
        <Relative>
          <AppToolbar />
          {this.props.chart &&
            React.cloneElement(this.props.chart)}
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
    windowWidth: state.ui.chartWidth
  }
}

export default connect(mapStateToProps)(AppMain)
