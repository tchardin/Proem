/**
 * The state of the app is now centralized in the Redux store
 * TODO (Dantino): Improve the <Graph /> component to fit domains and remain
 * full screen (Currently getting that annoying scroll)
 * TODO (Dantino or Thomas): enable zoom/scroll and tooltips.
 * TODO (Thomas): Finish all cards
 * TODO (Thomas): Toggle between portfolio and discovery views
 * TODO (Thomas): Dynamic portfolio metrics
 * TODO (Thomas): Map views to Browser history
 * TODO (Thomas): Blockstack login and storage
 */


import React, { Component } from 'react'
import {connect} from 'react-redux'
// import local css as s.
import s from './styles.css'
// import global css as gs
import gs from './../../styles/grid.css'
import Graph from '../../components/Graph/Graph'
import ChartContainer from '../../components/Graph/ChartContainer'
import FlatList from '../../components/FlatList/FlatList'
import Cards from '../../components/Card/Card'

import {loadIds} from '../../market/ids'
import {loadUser, signUserOut} from '../../market/auth'

class HomePage extends Component {

  componentDidMount() {
    // Loading currencies
    this.props.loadIds()
    this.props.loadUser()
  }

  render() {
    const {ids, user, signUserOut} = this.props
    if (ids.isFetching) {
      return (
        <div className={s.fullSize}>
          <div className={s.center}>
            <div className={s.ball}></div>
            <div className={s.ball1}></div>
          </div>
        </div>
      )
    }
    return (
      <div className={s.fullSize}>
        <div className={s.nav}>
          <div className={s.container}>
            <h1 className={s.brand}>
              PROEM
            </h1>
            {user.info &&
              <h2 className={s.hello}>
                Hello, {user.info.username.slice(0, -3)}
              </h2>
            }
            {user.info &&
              <a className={s.signOut}
                onClick={() => signUserOut()}>
                Sign Out
              </a>
            }
          </div>
        </div>
        <Cards />
        <ChartContainer />
        <FlatList />
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
})(HomePage)
