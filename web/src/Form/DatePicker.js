/*
 *
 * Wrapper for Airbnb's date picker
 *
 */

import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import Arrow from '../svg/Arrow'
import {updateForm, focusDate} from '../store/form'

import DayPickerInput from 'react-day-picker/DayPickerInput'
import {formatDate, parseDate} from 'react-day-picker/moment'
import 'react-day-picker/lib/style.css'


const Wrapper = styled.div`
  font-family: 'Gotham', sans-serif;
  & .DayPickerInput {
    width: 100%;
  }
  & .DayPicker-Day--selected {
    color: white;
    background: black;
    border-radius: 0;
  }
  & input {
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
    padding: 0;
    width: 100%;
    &::placeholder {
      color: white;
      padding-left: 0.5em;
    }
    &:focus {
      outline: none;
    }
  }
`

class DatePicker extends React.Component {
  render() {
    const {
      handleChange,
      date
    } = this.props
    let future = {after: new Date()}
    return (
      <Wrapper>
        <DayPickerInput
          onDayChange={day => handleChange('portfolio', 'date', day)}
          dayPickerProps={{
            selectedDays: date,
            disabledDays: day => day > new Date(),
            toMonth: new Date()
          }}
          formatDate={formatDate}
          parseDate={parseDate}
          placeholder="MM/DD/YYYY"
          value={date}/>
      </Wrapper>
    )
  }
}

export default DatePicker
