/**
 * Alerts stored on user Blockstack storage
 *
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import anime from 'animejs'

import Button from '../Button/Button'
import Cross from '../svg/Cross'
import AlertItem from './AlertItem'
import {update, reset} from '../../market/import'
import {addAlert} from '../../market/alerts'

import s from './styles.css'

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
  }
  toggleInput() {
    this.setState(prevState => ({
      input: !prevState.input
    }))
    this.props.reset()
  }
  toggleDisplay() {
    const {display} = this.state
    const newMargin = display ? '-140px' : '10px'
    anime({
      targets: this.alertsCard,
      marginLeft: newMargin,
      duration: 1000,
      easing: 'easeOutElastic'
    })
    this.setState(prevState => ({
      display: !prevState.display
    }))
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
  render() {
    const {input, display} = this.state
    const {amount, currency, crypto, allIds, alertsByID} = this.props
    let options = crypto.map(
      id => <option value={id} key={id}>{id}</option>)
    let alerts = allIds.length ? allIds.map(id => (
      <AlertItem id={id} key={id}/>
    )) : null
    let cardBody
    if (input) {
      cardBody = (
        <div className={s.form}>
          <div className={s.field}>
            <div className={s.control}>
              <input
                className={s.input}
                type="number"
                name="amount"
                placeholder="Amount"
                value={amount}
                onChange={this.handleChange}/>
            </div>
          </div>
          <div className={s.field}>
            <div className={s.control}>
              <div className={s.select}>
                <select
                  name="currency"
                  value={currency}
                  onChange={this.handleChange}>
                  {options}
                </select>
              </div>
            </div>
          </div>
          <div className={s.btnContainer}>
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
        <div className={s.list}>
          {alerts === null ? (
            <div className={s.label}>
              Click on the + to add alerts
            </div>) : alerts}
        </div>
      )
    }
    return (
      <div className={s.alertsCard} ref={div => this.alertsCard = div}>
        <div className={s.cardHeader}>
          <h1 className={display ? s.cardTitleOpen : s.cardTitle}
            onClick={() => this.toggleDisplay()}>ALERTS</h1>
          { display &&
            <div className={s.headerBtn}
              onClick={() => this.toggleInput()}>
              <Cross
                color="#fff"
                direction={input ? 'cancel' : 'plus'} />
            </div>}
        </div>
        <div className={s.cardBody}>
          {display && cardBody}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {form, ids, alerts} = state
  const {amount, currency} = form
  const {crypto} = ids
  const {allIds, alertsByID} = alerts
  return {amount, currency, crypto, allIds, alertsByID}
}

export default connect(mapStateToProps, {update, reset, addAlert})(AlertsCard)
