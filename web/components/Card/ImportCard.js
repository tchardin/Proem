import React, {Component} from 'react'
import {connect} from 'react-redux'
import anime from 'animejs'
// local shared styles with all cards to maintain consistency
import s from './styles.css'
import Arrow from '../svg/Arrow' // Svg icons
import Button from '../Button/Button'
import Cross from '../svg/Cross'
import {update, reset} from '../../market/import'
import {updatePortfolio} from '../../market/portfolio'

class ImportCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: false
    }
    this.toggleInput = this.toggleInput.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  toggleInput() {
    const {input} = this.state
    const newMargin = input ? '-160px' : '10px'
    this.setState(prevState => ({
      input: !prevState.input
    }))
    anime({
      targets: this.portfolioCard,
      marginLeft: newMargin,
      duration: 1000,
      easing: 'easeOutElastic'
    })
  }
  handleChange({target}) {
    const {name, value} = target
    this.props.update(name, value)
  }
  handleSubmit() {
    const {amount, date, currency} = this.props
    this.props.updatePortfolio(currency, amount, date)
    this.props.reset()
    this.toggleInput()
  }
  render() {
    const {input} = this.state
    const {amount, date, currency, ids} = this.props
    let options = ids.crypto.map(
      id => <option value={id} key={id}>{id}</option>)
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
              <input
                className={s.input}
                type="datetime-local"
                name="date"
                value={date}
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
              type="second" />
            <Button
              caption="import"
              type="primary"
              onClick={this.handleSubmit} />
          </div>
        </div>
      )
    } else {
      cardBody = (
        <div className={s.portfolio}>
          <div className={s.label}>
            Click on the + to add assets
          </div>
        </div>
      )
    }
    return (
      <div className={s.portfolioCard} ref={div => this.portfolioCard = div}>
        <div className={s.cardHeader}>
          <h1 className={s.cardTitle}>PORTFOLIO</h1>
          <div className={s.headerBtn}
            onClick={() => this.toggleInput()}>
            <Cross
              color="#fff"
              direction={input ? 'cancel' : 'plus'} />
          </div>
        </div>
        <div className={s.cardBody}>
          {cardBody}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {form, ids} = state
  const {
    amount,
    date,
    currency
  } = form
  return {
    amount,
    date,
    currency,
    ids
  }
}

export default connect(mapStateToProps, {
  update,
  updatePortfolio, reset
})(ImportCard)
