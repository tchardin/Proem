import React, { Component } from 'react'
import {connect} from 'react-redux'
// import local css as s.
import './App.css'

import {ChartContainer, ChartController} from './chart'
import Cards from './cards'

import {loadIds} from './store/ids'
import {loadUser, signUserOut} from './store/user'

class App extends Component {

  componentDidMount() {
    // Loading currencies
    this.props.loadIds()
    this.props.loadUser()
  }

  render() {
    const {ids, user, signUserOut} = this.props
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
        <Cards />
        <ChartContainer />
        <ChartController />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {ids, user} = state
  return {
    ids,
    user
  }
}

export default connect(mapStateToProps, {
  loadIds,
  loadUser,
  signUserOut
})(App)
