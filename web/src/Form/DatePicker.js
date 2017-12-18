/*
 *
 * Wrapper for Airbnb's date picker
 *
 */

import React from 'react'
import styled from 'styled-components'

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
    width: 100%;
    padding: 0 0.5em;
    box-sizing: border-box;
    &::placeholder {
      color: white;
    }
    &:focus {
      outline: none;
    }
  }
`

const DatePicker = ({
  handleChange,
  date
}) => {
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

export default DatePicker
