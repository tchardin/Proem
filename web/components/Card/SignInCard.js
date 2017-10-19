// 0State card prompting the user to sign in before importing portfolio

import React, {Component} from 'react'
import {connect} from 'react-redux'
import s from './styles.css'
import Button from '../Button/Button'
import {signUserIn} from '../../market/auth'

class SignInCard extends Component {
  handleSubmit() {
    this.props.dispatch(signUserIn())
  }
  render() {
    return (
      <div className={s.card}>
        <div className={s.cardHeader}>
          <h1 className={s.cardTitle}>WELCOME</h1>
        </div>
        <div className={s.cardBody}>
          <div className={s.btnContainer}>
            <Button
              caption="Sign In"
              type="primary"
              onClick={() => this.handleSubmit()} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(SignInCard)
