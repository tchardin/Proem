/**
 * The state of the app is centralized in the HomePage component
 * TODO (Dantino): Plug in with the real API
 * Check out the ./utils/simple-object.json for the data structure
 * I tried to group by currency objects in array so if you can
 * parse the results like that you probably won't have trouble fitting
 * the components.
 * TODO (Dantino): Improve the <Graph /> component to fit domains and remain
 * full screen (Currently getting that annoying scroll)
 * TODO (Dantino or Thomas): enable zoom/scroll and tooltips.
 * TODO (Thomas): Finish all cards
 * TODO (Thomas): Toggle between portfolio and discovery views
 * TODO (Thomas): Dynamic portfolio metrics
 * TODO (Thomas): Map views to Browser history
 * TODO (Thomas): Blockstack login and storage
 * TODO (Thomas): Set up Redux store
 */


import React, { Component } from 'react'
import {connect} from 'react-redux'
// import local css as s.
import s from './styles.css'
// import global css as gs
import gs from './../../styles/grid.css'

import {
  ImportCard,
  MetricsCard,
  SignInCard
} from '../../components/Card/'
import Graph from '../../components/Graph/Graph'
import Button from '../../components/Button/Button'
import FlatList from '../../components/FlatList/FlatList'

import {loadCurrencies, selectCurrency} from '../../market/actions'

const loadData = ({loadCurrencies}) => {
  loadCurrencies()
}

// Fake API response object for prototyping
const apiResponse = require('../../utils/simple-object.json')

// Blockstack js library
const blockstack = require('blockstack')
const STORAGE_FILE = 'portfolio.json'

class HomePage extends Component {

  displayItem = nextCurrency => {
    this.props.selectCurrency(nextCurrency)
  }

  componentDidMount() {
    // Loading currencies
    loadData(this.props)
  }

  render() {
    const {allIds, currenciesById, selectedCurrency, history} = this.props
    if (currenciesById.isFetching) {
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
          </div>
        </div>
        <Graph
          data={history.items}
          maxPoints={100}/>
        <FlatList
          ids={allIds}
          items={currenciesById}
          share={23}
          onSelectItem={this.displayItem}
          selectedItem={selectedCurrency}/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {allIds, currenciesById, selectedCurrency} = state
  const {
    history,
    metrics
  } = currenciesById[selectedCurrency] || {
    history: {},
    metrics: {}
  }
  return {
    allIds,
    currenciesById,
    selectedCurrency,
    history,
    metrics
  }
}

export default connect(mapStateToProps, {loadCurrencies, selectCurrency})(HomePage)
