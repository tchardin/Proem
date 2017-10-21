import React, {Component} from 'react'
import {connect} from 'react-redux'
import s from './styles.css'

import {VictoryPie} from 'victory'

class PortfolioContainer extends Component {
  calculateTotal(allIds, assets, metrics, selectedFiat) {

  }
  render() {
    const {allIds, assets, metrics, selectedFiat} = this.props
    if (!allIds.length) {
      return (
        <div className={s.portfolioContainer}>
          <div className={s.label}>
            Click on the + to add assets
          </div>
        </div>
      )
    }
    // Calculate totals for each asset
    let allBalances = allIds.map(id =>
      assets[id].balance * metrics[id][selectedFiat].items.price)
    // Calculate the total value of the portfolio
    let total = allBalances.reduce((a, b) => a + b, 0)
    // Calculate the percent share of total portfolio for each asset
    let allPercentShares = allBalances.map(balance => balance/total)
    let sharesById = allIds.map(id => {
      return {
        x: id, y: assets[id].balance*metrics[id][selectedFiat].items.price/total
      }
    })
    // Calculate how much percent change for each asset
    let allPercentChanges = allIds.map(id =>
      Number(metrics[id][selectedFiat].items.percent_change_24h))
    // Calculate weighted average for total 24h change of portfolio
    let totalPercentChange = 0
    for (let i = 0; i < allIds.length; i++) {
      totalPercentChange += allPercentShares[i]*allPercentChanges[i]
    }
    let items = allIds.map(id => {
      let percentShare = assets[id].balance*metrics[id][selectedFiat].items.price/total
      return (
        <div className={s.portfolioItem} key={id}>
          <div className={s.assetTitle}>{id}</div>
          <div className={s.assetShare}>
            {Math.round(percentShare*10000)/100}%
          </div>
        </div>
      )}
    )

    let pie = <VictoryPie
                data={sharesById}
                padding={0}
                colorScale={["#FFF500", "#FF00C4", "#FFA700", "#0089FF", "#B100FF"]}
                innerRadius={100}
                labelRadius={130}
                style={{ labels: { fill: "#00CEFF", fontSize: 30, fontWeight: "bold", fontFamily: 'Gotham' } }}
                />

    return (
      <div className={s.portfolioContainer}>
        <div className={s.portfolioHeader}>
          <div className={s.total}>{new Intl.NumberFormat('en-US', {style: 'currency', currency: selectedFiat}).format(total)}</div>
          <div className={totalPercentChange < 0 ? s.nTotalChange : s.pTotalChange}>
            {Math.round(totalPercentChange*100)/100}%
          </div>
        </div>
        <div className={s.portfolioBody}>
         {pie}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {portfolio, metrics, ids} = state
  const {allIds, assets} = portfolio
  const {selectedFiat} = ids
  return {
    allIds,
    assets,
    metrics,
    selectedFiat
  }
}

export default connect(mapStateToProps)(PortfolioContainer)
