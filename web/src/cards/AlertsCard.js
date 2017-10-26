/**
 * Alerts stored on user Blockstack storage
 *
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import anime from 'animejs'

import Button from '../components/Button/Button'
import Cross from '../components/svg/Cross'
import AlertItem from './AlertItem'

import './Cards.css'

const AlertsCard = ({
  amount,
  currency,
  crypto,
  allIds,
  alertsByID,
  display,
  showCard,
  resetForm,
  displayForm,
  updateForm,
  addAlert,
  removeAlert,
  toggleCard
}) => {
  let alertsCard

  const handleChange = ({target}) => {
    const {name, value} = target
    updateForm('alerts', name, value)
  }

  const handleSubmit = () => {
    addAlert(currency, amount)
    resetForm('alerts')
  }

    let options = crypto.map(
      id => <option value={id} key={id}>{id}</option>)

    let alerts = allIds.length ? allIds.map(id => (
      <AlertItem
        alerts={alertsByID}
        id={id}
        key={id}
        onDelete={() => removeAlert(id)}/>
    )) : null

    let cardBody
    if (display) {
      cardBody = (
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
              onClick={() => resetForm('alerts')}/>
            <Button
              caption="set"
              type="primary"
              onClick={handleSubmit}/>
          </div>
        </div>
      )
    } else {
      cardBody = (
        <div className="list">
          {alerts === null ? (
            <div className="label">
              Click on the + to add alerts
            </div>) : alerts}
        </div>
      )
    }
    return (
      <div className="alertsCard" ref={div => alertsCard = div}>
        <div className="cardHeader">
          <h1 className={showCard ? "cardTitleOpen" : "cardTitle"}
            onClick={() => toggleCard(alertsCard, 'alerts')}>ALERTS</h1>
          { showCard &&
            <div className="headerBtn"
              onClick={() => displayForm('alerts')}>
              <Cross
                size="14px"
                color="#fff"
                direction={display ? 'cancel' : 'plus'} />
            </div>}
        </div>
        <div className="cardBody">
          {showCard && cardBody}
        </div>
      </div>
    )
}

export default AlertsCard
