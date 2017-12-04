/* @flow */

import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {updateSelected} from '../store/ui'

import Briefcase from '../svg/Briefcase'

const ToolContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: 'Gotham', sans-serif;
  color: black;
  width: 100%;
`

const Title = styled.h2`
  font-size: 1em;
  padding-left: 1em;
`

const ToolHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  border-bottom: solid black 2px;
`

const ToolList = styled.ul`
  display: flex;
  flex: 2;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
`

const Tool = styled.li`
  width: 100%;
  font-size: 0.7em;
  padding: 1.5em 0.25em 0 0.25em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
`

const Switch = styled.input`
  position: absolute;
  right: 0px;
  &:before {
    content: "";
    position: absolute;
    right: -2px;
    top: -6px;
    display: block;
    width: 36px;
    height: 20px;
    border-radius: 14px;
    background: #fff;
    border: 1px solid #d9d9d9;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  &:after {
    content: "";
    position: absolute;
    right: -2px;
    top: -6px;
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 14px;
    background: #fff;
    border: 1px solid #d9d9d9;
    margin-right: 16px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  &:hover:after {
    box-shadow: 0 0 5px rgba(0,0,0,0.3);
  }
  &:checked:after {
    margin-right: 0px;
  }
  &:checked:before {
    background: black;
  }
`

class ToolBox extends React.Component {
  handleChange = ({target}) => {
    this.props.updateSelected(target.name, target.checked)
  }
  render() {
    const {
      sma, ema, bol
    } = this.props
    return (
      <ToolContainer>
        <ToolHeader>
          <Briefcase />
          <Title>TOOLBOX</Title>
        </ToolHeader>
        <ToolList>
          <Tool>
            <label htmlFor="sma">Simple Moving Average</label>
            <Switch
              type="checkbox"
              name="sma"
              checked={sma}
              onChange={this.handleChange}/>
          </Tool>
          <Tool>
            <label htmlFor="ema">Exponential Moving Average</label>
            <Switch
              type="checkbox"
              name="ema"
              checked={ema}
              onChange={this.handleChange}/>
          </Tool>
          <Tool>
            <label htmlFor="bol">Bollinger Band</label>
            <Switch
              type="checkbox"
              name="bol"
              checked={bol}
              onChange={this.handleChange}/>
          </Tool>
        </ToolList>
      </ToolContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
    sma: state.ui.sma,
    ema: state.ui.ema,
    bol: state.ui.bol
  }
}

export default connect(mapStateToProps, {
  updateSelected
})(ToolBox)
