// 0State card prompting the user to sign in before importing portfolio

import React, {Component} from 'react'
import {connect} from 'react-redux'
import './Cards.css'
import Button from '../components/Button/Button'
import {signUserIn} from '../store/user'

class SignInCard extends Component {
  handleSubmit() {
    this.props.dispatch(signUserIn())
  }
  render() {
    return (
      <div className="signInCard">
        <div className="signInHeader">
          <h1 className="signInTitle">WELCOME</h1>
        </div>
        <div className="signInBody">
          <div className="btnContainer">
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
