/**
 * The state of the app is centralized in the HomePage component
 * TODO (Dantino): Plug in with the real API
 * Check out the ./utils/simple-object.json for the data structure
 * I tried to group by currency objects in array so if you can
 * parse the results like that you probably won't have trouble fitting
 * the components.
 * TODO (Dantino): Improve the <Graph /> component to fit domains and remain
 * full screen (Currently getting that annoying scroll)
 * + enable zoom/scroll and tooltips.
 * TODO (Thomas): Finish all cards and allow portfolio import
 * TODO (Thomas): Blockstack login and storage
 * TODO (Thomas): Set up Redux store
 */


import React, { Component } from 'react'

// import local css as s.
import s from './styles.css'
// import global css as gs
import gs from './../../styles/grid.css'

import {ImportCard, MetricsCard} from '../../components/Card/'
import Graph from '../../components/Graph/Graph'
import Button from '../../components/Button/Button'
import FlatList from '../../components/FlatList/FlatList'

// Fake API response object for prototyping
const apiResponse = require('../../utils/simple-object.json')

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currencies: [],
      displayed: [],
      portfolio: [],
      selected: {}
    }
    this.selectItem = this.selectItem.bind(this)
    this.displayItem = this.displayItem.bind(this)
    this.addAsset = this.addAsset.bind(this)
  }

  addAsset(a, d, c) {
    let asset = {
      amount: a,
      date: d,
      currency: c
    }
    const {portfolio} = this.state
    this.setState({
      portfolio: portfolio.concat(asset)
    })
  }

  // Selected currency has info displayed on card
  selectItem(e) {
    this.setState({
      selected: e
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
    // Display default with first item of array
    let d = this.state.displayed.concat(apiResponse.data[0])
    // Load all the api data in the currencies array.
    // Make Ajax call here.
    this.setState({
      currencies: apiResponse.data,
      displayed: d
    })
  }

  render() {
    let card
    if (this.state.selected.info) {
      card = <MetricsCard
              item={this.state.selected} />
    } else {
      card = <ImportCard
              currency={this.state.selected}
              handleSubmit={this.addAsset}/>
    }
    return (
<<<<<<< HEAD
      <div className={s.fullSize}>
        <div className={s.nav}>
          <div className={s.container}>
            <h1 className={s.brand}>
              PROEM
            </h1>
            <Button
              type="primary"
              caption="Sign In"
              target="/coins"
              style={s.button}/>
=======
      <div className={gs.container}>
        <div className={gs.line}>
          <div className={s.cardContainer}>
            <Card
              target="/bitcoin"
              header="Bitcoin"
              ticker="BTC"
              />
          </div>
          <div className={s.cardContainer}>
            <Card
              target="/bitcoin"
              header="Ethereum"
              ticker="ETH"
              />
          </div>
          <div className={s.cardContainer}>
            <Card
              target="/bitcoin"
              header="Litecoin"
              ticker="LTC"
              />
>>>>>>> 8a082a6f92893832527bc6d1a201aceee86bc521
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
          selectedItems={this.state.displayed}/>
      </div>
    )
  }
}

export default HomePage
