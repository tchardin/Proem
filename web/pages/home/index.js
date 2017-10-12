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

// Fake API response object for prototyping
const apiResponse = require('../../utils/simple-object.json')

// Blockstack js library
const blockstack = require('blockstack')
const STORAGE_FILE = 'portfolio.json'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currencies: [], // All currency data loaded from API
      displayed: [], // Selected in menu to show in the chart
      portfolio: [], // Added from the input form
      selected: {}, // Selected by clicking on a chart area
      mainView: 'discovery', // Toggle between Graphs
      cardView: 'import', // Toggle between cards
      user: null, // User profile populated by Blockstack API
      amount: 0, // Amount input in import card
      date: '', // Date input in import card
      currency: '', // Currency input in import card
      fiat: 'USD' // global fiat currency output
    }
    this.selectItem = this.selectItem.bind(this)
    this.displayItem = this.displayItem.bind(this)
    this.addAsset = this.addAsset.bind(this)
    this.fillImportForm = this.fillImportForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.signIn = this.signIn.bind(this)
  }

  // Sign in with Blockstack
  signIn() {
    blockstack.redirectToSignIn()
  }

  // Import asset form actions
  fillImportForm() {
    const {user} = this.state
    this.setState({
      cardView: user ? 'import' : 'signin'
    })
  }
  handleChange({target}) {
    this.setState({
      [target.name]: target.value
    })
  }
  addAsset() {
    const {portfolio, amount, date, currency} = this.state
    let asset = {
      amount: amount,
      date: date,
      currency: currency
    }
    let encrypt = true
    this.setState({
      portfolio: portfolio.concat(asset),
      cardView: 'metrics'
    }, blockstack.putFile(STORAGE_FILE,
      JSON.stringify(this.state.portfolio), encrypt))
  }

  // Selected currency has info displayed on card
  selectItem(e) {
    this.setState({
      selected: e,
      cardView: 'metrics',
      currency: e.id
    })
  }

  // Array of chart areas to be displayed
  displayItem(e) {
    let s = this.state.displayed
    if (s.includes(e)) {
      let selection = s.filter(item => {
        return item != e
      })
      this.setState({
        displayed: selection
      })
    } else {
      this.setState({
        displayed: s.concat(e)
      })
    }
  }

  componentDidMount() {
    // Check Blockstack state to retreive user profile and data
    if (blockstack.isUserSignedIn()) {
      let newUser = blockstack.loadUserData().profile
      const decrypt = true
      blockstack.getFile(STORAGE_FILE, decrypt)
      .then((data) => {
        let savedPortfolio = JSON.parse(data || '[]')
        this.setState({
          user: newUser,
          portfolio: savedPortfolio
        })
      })
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn()
      .then((userData) => {
        window.location = window.location.origin
      })
    }
    const {user} = this.state
    // Display default with first item of array
    let d = this.state.displayed.concat(apiResponse.data[0])
    // Load all the api data in the currencies array.
    // Make Ajax call here.
    this.setState({
      currencies: apiResponse.data,
      displayed: d,
      cardView: user ? 'import' : 'signin'
    })
  }

  render() {
    let allIds = this.state.currencies.map(c => c.id)
    let card
    if (this.state.cardView === 'metrics') {
      card = <MetricsCard
              item={this.state.selected}
              onSubmit={this.fillImportForm}/>
    } else if (this.state.cardView === 'import') {
      card = <ImportCard
              currency={this.state.currency}
              date={this.state.date}
              amount={this.state.amount}
              select={allIds}
              onSubmit={this.addAsset}
              onChange={this.handleChange}/>
    } else if (this.state.cardView === 'signin') {
      card = <SignInCard
              onSubmit={this.signIn}/>
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
        <div className={s.infoCard}>
          {card}
        </div>
        <Graph
          data={this.state.displayed}
          onSelectArea={this.selectItem}/>
        <FlatList
          items={this.state.currencies}
          onSelectItem={this.displayItem}
          selectedItems={this.state.displayed}
          share={23}
          fiat={this.state.fiat}
          onChange={this.handleChange}/>
      </div>
    )
  }
}

export default HomePage
