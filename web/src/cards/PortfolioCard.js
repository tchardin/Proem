import React, {Component} from 'react'
import {connect} from 'react-redux'
import anime from 'animejs'
// local shared styles with all cards to maintain consistency
import './Cards.css'

import {SingleDatePicker} from 'react-dates'

import Arrow from '../components/svg/Arrow' // Svg icons
import Button from '../components/Button/Button'
import Cross from '../components/svg/Cross'
import Portfolio from './PortfolioContainer'

const PortfolioCard = ({
  amount,
  date,
  focused,
  currency,
  crypto,
  selectedFiat,
  metrics,
  allIds,
  assets,
  display,
  showCard,
  resetForm,
  displayForm,
  updateForm,
  focusDate,
  newTransaction,
  toggleCard
}) => {
  let portfolioCard
  const handleChange = ({target}) => {
    const {name, value} = target
    updateForm('portfolio', name, value)
  }
  const handleSubmit = () => {
    newTransaction(currency, amount, date)
    resetForm('portfolio')
  }

    let options = crypto.map(
      id => <option value={id} key={id}>{id}</option>)

    let inputFields = (
        <div className="form">
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="number"
                name="amount"
                placeholder="Amount"
                value={amount}
                onChange={handleChange}/>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <SingleDatePicker
                date={date}
                onDateChange={date => {
                  let target = {
                    name: 'date',
                    value: date
                  }
                  console.log(date.format('MM-DD-YYYY'))
                  handleChange({target})
                }}
                placeholder="Date"
                focused={focused}
                onFocusChange={({focused}) => focusDate()}
                numberOfMonths={1}
                isOutsideRange={day => day > new Date()}
                hideKeyboardShortcutsPanel
                />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <div className="select">
                <select
                  name="currency"
                  value={currency}
                  onChange={handleChange}>
                  {options}
                </select>
              </div>
            </div>
          </div>
          <div className="btnContainer">
            <Button
              caption="cancel"
              type="second"
              onClick={() => resetForm('portfolio')}/>
            <Button
              caption="import"
              type="primary"
              onClick={handleSubmit} />
          </div>
        </div>
      )
    return (
      <div className="portfolioCard" ref={div => portfolioCard = div}>
        <div className="cardHeader">
          <h1 className={showCard ? "cardTitleOpen" : "cardTitle"}
            onClick={() => {
              toggleCard(portfolioCard, 'portfolio')
              resetForm('portfolio')
            }}>PORTFOLIO</h1>
          {showCard &&
          <div className="headerBtn"
            onClick={() => displayForm('portfolio')}>
            <Cross
              size="14px"
              color="#fff"
              direction={display ? 'cancel' : 'plus'} />
          </div>}
        </div>
        <div className="cardBody">
          {display ? inputFields :
          <Portfolio
            selectedFiat={selectedFiat}
            metrics={metrics}
            allIds={allIds}
            assets={assets}/>}
        </div>
      </div>
    )
}

export default PortfolioCard
