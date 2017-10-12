// 0State card prompting the user to sign in before importing portfolio

import React, {Component} from 'react'

import s from './styles.css'

class CardComponent extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit() {
    this.props.onSubmit()
  }
  render() {
    return (
      <div className={s.card}>
        <h1 className={s.cardHeader}>
          Sign in with Blockstack to import your portfolio
        </h1>
        <div className={s.cardBody}>
          <div className={s.btnContainer}>
            <button
              className={s.btn}
              onClick={() => this.handleSubmit()}>Sign In</button>
          </div>
        </div>
      </div>
    )
  }
}

export default CardComponent
