import React, {Component} from 'react'
import {connect} from 'react-redux'
import anime from 'animejs'
// local shared styles with all cards to maintain consistency
import './Cards.css'
import Arrow from '../components/svg/Arrow' // Svg icons
import Button from '../components/Button/Button'
import Cross from '../components/svg/Cross'
import Portfolio from './PortfolioContainer'
import {update, reset} from '../store/form'
import {newTransaction} from '../store/portfolio'
import {changeView} from '../store/ui'

class PortfolioCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: false
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
    const {display} = this.props
    const newMargin = display ? '-180px' : '10px'
    anime({
      targets: this.portfolioCard,
      marginLeft: newMargin,
      duration: 1000,
      easing: 'easeOutElastic'
    })
    this.props.changeView('portfolio')
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
    const {input} = this.state
    const {amount, date, currency, ids, allIds, display} = this.props
    let options = ids.crypto.map(
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
                onChange={this.handleChange}/>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="datetime-local"
                name="date"
                value={date}
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
              type="second" />
            <Button
              caption="import"
              type="primary"
              onClick={this.handleSubmit} />
          </div>
        </div>
      )
    return (
      <div className="portfolioCard" ref={div => this.portfolioCard = div}>
        <div className="cardHeader">
          <h1 className={display ? "cardTitleOpen" : "cardTitle"}
            onClick={() => this.toggleDisplay()}>PORTFOLIO</h1>
          {display &&
          <div className="headerBtn"
            onClick={() => this.toggleInput()}>
            <Cross
              size="14px"
              color="#fff"
              direction={input ? 'cancel' : 'plus'} />
          </div>}
        </div>
        <div className="cardBody">
          {input ? inputFields :
          <Portfolio />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {form, ids, portfolio, ui} = state
  const {
    amount,
    date,
    currency
  } = form
  const {allIds} = portfolio
  return {
    display: ui.portfolio,
    amount,
    date,
    currency,
    ids,
    allIds
  }
}

export default connect(mapStateToProps, {
  update,
  newTransaction,
  reset,
  changeView
})(PortfolioCard)
