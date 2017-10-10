import React, {Component} from 'react'
// local shared styles with all cards to maintain consistency
import s from './styles.css'

class CardComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      amount: 0,
      date: '',
      currency: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange({target}) {
    this.setState({
      [target.name]: target.value
    })
  }
  handleSubmit(e) {
    e.preventDefault()
    const {amount, date, currency} = this.state
    this.props.handleSubmit(amount, date, currency)
  }
  componentDidMount() {
    let c = this.props.currency
    if (c) {
      this.setState({
        currency: c
      })
    }
  }
  render() {
    return (
      <div className={s.card}>
        <h1 className={s.cardHeader}>Add Curency to your portfolio</h1>
        <div className={s.cardBody}>
          <div className={s.form}>
            <div className={s.field}>
              <label className={s.label}>Amount Purchased</label>
              <div className={s.control}>
                <input
                  className={s.input}
                  type="number"
                  placeholder="Price in currency"
                  value={this.state.amount}
                  onChange={this.handleChange}/>
              </div>
            </div>
            <div className={s.field}>
              <label className={s.label}>Date and Time</label>
              <div className={s.control}>
                <input
                  className={s.input}
                  type="datetime-local"
                  value={this.state.date}
                  onChange={this.handleChange}/>
              </div>
            </div>
            <div className={s.field}>
              <label className={s.label}>Currency</label>
              <div className={s.control}>
                <div className={s.select}>
                  <select>
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>LTC</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={s.btnContainer}>
              <button
                className={s.btn}
                onClick={() => this.handleSubmit()}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CardComponent
