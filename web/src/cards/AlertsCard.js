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
import {update, reset} from '../store/form'
import {addAlert, removeAlert} from '../store/alerts'
import {changeView} from '../store/ui'

import './Cards.css'

class AlertsCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: false,
      display: false
    }
    this.toggleDisplay = this.toggleDisplay.bind(this)
    this.toggleInput = this.toggleInput.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }
  toggleInput() {
    this.setState(prevState => ({
      input: !prevState.input
    }))
    this.props.reset()
  }
  toggleDisplay() {
    const {display} = this.props
    const newMargin = display ? '-180px' : '10px'
    anime({
      targets: this.alertsCard,
      marginLeft: newMargin,
      duration: 1000,
      easing: 'easeOutElastic'
    })
    this.props.changeView('alerts')
  }
  handleChange({target}) {
    const {name, value} = target
    this.props.update(name, value)
  }
  handleSubmit() {
    const {amount, currency} = this.props
    this.props.addAlert(currency, amount)
    this.props.reset()
    this.toggleInput()
  }
  handleDelete(id) {
    this.props.removeAlert(id)
  }
  render() {
    const {input} = this.state
    const {amount, currency, crypto, allIds, alertsByID, display} = this.props
    let options = crypto.map(
      id => <option value={id} key={id}>{id}</option>)
    let alerts = allIds.length ? allIds.map(id => (
      <AlertItem
        alerts={alertsByID}
        id={id}
        key={id}
        onDelete={() => this.handleDelete(id)}/>
    )) : null
    let cardBody
    if (input) {
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
                onChange={this.handleChange}/>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <div className="select">
                <select
                  name="currency"
                  value={currency}
                  onChange={this.handleChange}>
                  {options}
                </select>
              </div>
            </div>
          </div>
          <div className="btnContainer">
            <Button
              caption="cancel"
              type="second"
              onClick={this.toggleInput}/>
            <Button
              caption="set"
              type="primary"
              onClick={this.handleSubmit} />
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
      <div className="alertsCard" ref={div => this.alertsCard = div}>
        <div className="cardHeader">
          <h1 className={display ? "cardTitleOpen" : "cardTitle"}
            onClick={() => this.toggleDisplay()}>ALERTS</h1>
          { display &&
            <div className="headerBtn"
              onClick={() => this.toggleInput()}>
              <Cross
                size="14px"
                color="#fff"
                direction={input ? 'cancel' : 'plus'} />
            </div>}
        </div>
        <div className="cardBody">
          {display && cardBody}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {form, ids, alerts, ui} = state
  const {amount, currency} = form
  const {crypto} = ids
  const {allIds, alertsByID} = alerts
  return {
    display: ui.alerts,
    amount,
    currency,
    crypto,
    allIds,
    alertsByID
  }
}

export default connect(mapStateToProps, {
  update, reset, addAlert, removeAlert, changeView
})(AlertsCard)
