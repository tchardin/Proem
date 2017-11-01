import React, { Component } from 'react'
import {connect} from 'react-redux'
import anime from 'animejs'
// import local css as s.
import './App.css'

import {ChartContainer, ChartController} from './chart'
import {SignInCard, MetricsCard, PortfolioCard, AlertsCard} from './cards'

import {loadIds} from './store/ids'
import {loadUser, signUserOut} from './store/user'
import {updateForm, resetForm, displayForm, focusDate} from './store/form'
import {addAlert, removeAlert} from './store/alerts'
import {newTransaction} from './store/portfolio'
import {changeView} from './store/ui'

class App extends Component {

  componentDidMount() {
    // Loading currencies
    this.props.loadIds()
    this.props.loadUser()
  }

  render() {
    const {
      ui,
      ids,
      user,
      alerts,
      portfolio,
      signUserOut,
      metrics,
      form,
      resetForm,
      displayForm,
      updateForm,
      focusDate,
      addAlert,
      removeAlert,
      newTransaction
    } = this.props

    if (ids.isFetching) {
      return (
        <div className="fullSize">
          <div className="center">
            <div className="ball"></div>
            <div className="ball1"></div>
          </div>
        </div>
      )
    }
    return (
      <div className="fullSize">
        <div className="nav">
          <div className="nav-container">
            <h1 className="brand">
              PROEM
            </h1>
            {user.info &&
              <h2 className="hello">
                Hello, {
                  user.info.username ? user.info.username.slice(0, -3) : 'Anonymous'}
              </h2>
            }
            {user.info &&
              <a className="signOut"
                onClick={() => signUserOut()}>
                Sign Out
              </a>
            }
          </div>
        </div>
        <ChartContainer />
        <ChartController />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {ids, user, metrics, form, alerts, ui, portfolio} = state
  return {
    ids,
    user,
    metrics,
    form,
    alerts,
    portfolio,
    ui
  }
}

export default connect(mapStateToProps, {
  loadIds,
  loadUser,
  signUserOut,
  resetForm,
  displayForm,
  updateForm,
  focusDate,
  addAlert,
  removeAlert,
  changeView,
  newTransaction
})(App)
