import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {updateForm, resetForm} from '../store/form'
import {newTransaction} from '../store/portfolio'
import Input from '../Form/Input'
import DatePicker from '../Form/DatePicker'
import Button from '../Button'
import CrossSvg from '../svg/Cross'

const Cross = styled.div`
  height: 20px;
  width: 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
`

const Line1 = styled.span`
  display: flex;
  height: 3px;
  background-color: black;
  transform: rotate(45deg) translateX(12px);
  border-radius: 2px;
`

const Line2 = styled.span`
  display: flex;
  height: 3px;
  background-color: black;
  transform: rotate(-45deg) translateX(12px);
  border-radius: 2px;
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  list-style-type: none;
  padding: 0;
  margin: 2em 0;
  width: 100%;
`

const Option = styled.li`
  /* border-bottom: solid #e6e6e6 1px; */
  padding: 0.5em 0;
  width: 100%;
  box-sizing: border-box;
  text-align: right;
`

class PForm extends React.Component {
  submitForm = () => {
    const {
      currency,
      amount,
      date,
      newTransaction,
      resetForm,
    } = this.props
    newTransaction(currency, amount, date)
    resetForm('portfolio')
  }
  render() {
    const {
      updateForm,
      amount,
      date,
      currency,
      options,
      resetForm
    } = this.props
    return (
      <List>
        <Option>
          <Input
            amount={amount}
            currency={currency}
            onChange={updateForm}
            ids={options}/>
        </Option>
        <Option>
          <DatePicker
            handleChange={updateForm}
            date={date}/>
        </Option>
        <Option>
          <Button
            type="primary"
            caption="Save"
            onPress={() => this.submitForm()}/>
        </Option>
        <Option>
          <Button
            type="secondary"
            caption="cancel"
            onPress={() => resetForm('portfolio')} />
        </Option>
      </List>
    )
  }
}

const mapStateToProps = state => ({
  amount: state.form.portfolio.amount,
  date: state.form.portfolio.date,
  currency: state.form.portfolio.currency
})

export default connect(mapStateToProps, {
  updateForm,
  resetForm,
  newTransaction
})(PForm)
