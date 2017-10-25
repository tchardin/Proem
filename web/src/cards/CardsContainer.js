/**
 * Selecting which cards to display
 *
 */

import React, { Component } from 'react'
import {connect} from 'react-redux'
import './Cards.css'

import SignInCard from './SignInCard'
import MetricsCard from './MetricsCard'
import PortfolioCard from './PortfolioCard'
import AlertsCard from './AlertsCard'

class CardRoot extends Component {
  render() {
    const {user} = this.props
    if (typeof user.info === 'undefined' || user.isLoading ) {
      return (
        <div className="infoCard">
          <div className="cardContainer">
            <SignInCard />
          </div>
        </div>
      )
    }
    return (
      <div className="infoCard">
        <div className="cardContainer">
          <MetricsCard />
          <PortfolioCard />
          <AlertsCard />
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  const {user} = state
  return {
    user
  }
}

export default connect(mapStateToProps)(CardRoot)
