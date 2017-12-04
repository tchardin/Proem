/**
 * Reusable input
 *
 * @flow
 */

import React from 'react'
import styled from 'styled-components'

const Field = styled.div`
  display: flex;
  align-items: center;
`
const Input = styled.input`
  display: flex;
  flex: 1;
  font-family: 'Gotham', sans-serif;
  font-size: 1em;
  line-height: 1em;
  color: black;
  background: #e6e6e6;
  border: 0;
  outlined: 0;
  height: 54px;
  padding: 0 0 0 0.5em;
  &::placeholder {
    color: white;
  }
  &:focus {
    outline: none;
  }
`

const CoinSelect = styled.select`
    moz-appearance: none;
    -webkit-appearance: none;
    align-items: center;
    border-radius: 3px;
    box-shadow: none;
    display: inline-flex;
    height: 54px;
    width: 54px;
    justify-content: center;
    line-height: 1.5;
    position: relative;
    vertical-align: top;
    background-color: black;
    color: #fff;
    cursor: pointer;
    display: block;
    font-size: 1em;
    outline: none;
    padding: 0 0 0 0.5em;
    & :after {
      border: 1px solid white;
      border-right: 0;
      border-top: 0;
      content: " ";
      display: block;
      height: 0.5em;
      pointer-events: none;
      position: absolute;
      transform: rotate(-45deg);
      width: 0.5em;
      margin-top: -0.375em;
      right: 1.125em;
      top: 50%;
      z-index: 0;
    }
`

class InputField extends React.Component {
  handleChange = ({target}) => {
    const {value, name} = target
    this.props.onChange('portfolio', name, value)
  }
  render() {
    const {onChange, amount, ids, currency} = this.props
    let options = ids.map(
      id => <option value={id} key={id}>{id}</option>)
    return (
      <Field>
        <Input
          type="number"
          name="amount"
          placeholder="Amount"
          value={amount}
          onChange={this.handleChange}/>
        <CoinSelect
          name="currency"
          value={currency}
          onChange={this.handleChange}>
          {options}
        </CoinSelect>
      </Field>
    )
  }
}

export default InputField
