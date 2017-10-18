// This is an example of a react component that can be reused throughout a site

import React, { Component } from 'react'
import {connect} from 'react-redux'
import s from './styles.css'

import SignInCard from './SignInCard'
import MetricsCard from './MetricsCard'
import ImportCard from './ImportCard'
import AlertsCard from './AlertsCard'

class CardRoot extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }
  render() {
    const {user} = this.props
    if (typeof user.info === 'undefined' || user.isLoading ) {
      return (
        <div className={s.infoCard}>
          <div className={s.cardContainer}>
            <SignInCard />
          </div>
        </div>
      )
    }
    return (
      <div className={s.infoCard}>
        <div className={s.cardContainer}>
          <MetricsCard />
          <ImportCard />
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
