import React, {Component} from 'react'
// local shared styles with all cards to maintain consistency
import s from './styles.css'

class CardComponent extends Component {
  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(e) {
    this.props.onChange(e)
  }
  handleSubmit() {
    this.props.onSubmit()
  }
  render() {
    const {amount, date, currency, select} = this.props
    let options = select.map(
      id => <option value={id} key={id}>{id}</option>)
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
                  name="amount"
                  placeholder="Price in currency"
                  value={amount}
                  onChange={this.handleChange}/>
              </div>
            </div>
            <div className={s.field}>
              <label className={s.label}>Date and Time</label>
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
              <label className={s.label}>Currency</label>
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
