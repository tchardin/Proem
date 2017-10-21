import React, {Component} from 'react'
import {connect} from 'react-redux'
import anime from 'animejs'
// local shared styles with all cards to maintain consistency
import s from './styles.css'
import Arrow from '../svg/Arrow' // Svg icons
import Button from '../Button/Button'
import Cross from '../svg/Cross'
import Portfolio from './PortfolioContainer'
import {update, reset} from '../../market/import'
import {newTransaction} from '../../market/portfolio'

class ImportCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: false,
      display: false
    }
    this.toggleInput = this.toggleInput.bind(this)
    this.toggleDisplay = this.toggleDisplay.bind(this)
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
      targets: this.portfolioCard,
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
    const {amount, date, currency} = this.props
    this.props.newTransaction(currency, amount, date)
    this.props.reset()
    this.toggleInput()
  }
  render() {
    const {input, display} = this.state
    const {amount, date, currency, ids, allIds} = this.props
    let options = ids.crypto.map(
      id => <option value={id} key={id}>{id}</option>)
    let inputFields = (
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
    // } else {
    //   cardBody = (
    //     <div className={s.portfolio}>
    //       <div className={s.label}>
    //         Click on the + to add assets
    //       </div>
    //     </div>
    //   )
    // }
    return (
      <div className={s.portfolioCard} ref={div => this.portfolioCard = div}>
        <div className={s.cardHeader}>
          <h1 className={display ? s.cardTitleOpen : s.cardTitle}
            onClick={() => this.toggleDisplay()}>PORTFOLIO</h1>
          {display &&
          <div className={s.headerBtn}
            onClick={() => this.toggleInput()}>
            <Cross
              color="#fff"
              direction={input ? 'cancel' : 'plus'} />
          </div>}
        </div>
        <div className={s.cardBody}>
          {input ? inputFields :
          <Portfolio />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {form, ids, portfolio} = state
  const {
    amount,
    date,
    currency
  } = form
  const {allIds} = portfolio
  return {
    amount,
    date,
    currency,
    ids,
    allIds
  }
}

export default connect(mapStateToProps, {
  update,
  newTransaction, reset
})(ImportCard)
