import React, {Component} from 'react'
import {connect} from 'react-redux'
import anime from 'animejs'
// local shared styles with all cards to maintain consistency
import './Cards.css'
import Arrow from '../components/svg/Arrow' // Svg icons
import Button from '../components/Button/Button'
import Cross from '../components/svg/Cross'
import Portfolio from './PortfolioContainer'

const PortfolioCard = ({
  amount,
  date,
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
              <input
                className="input"
                type="datetime-local"
                name="date"
                value={date}
                onChange={handleChange}/>
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
            onClick={() => toggleCard(portfolioCard, 'portfolio')}>PORTFOLIO</h1>
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
