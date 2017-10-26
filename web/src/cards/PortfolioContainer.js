import React, {Component} from 'react'
import {connect} from 'react-redux'
import './Cards.css'

import {VictoryPie} from 'victory'

const PortfolioContent = ({allIds, assets, metrics, selectedFiat}) => {

    if (!allIds.length) {
      return (
        <div className="portfolioContainer">
          <div className="label">
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
        <div className="portfolioItem" key={id}>
          <div className="assetTitle">{id}</div>
          <div className="assetShare">
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
      <div className="portfolioContainer">
        <div className="portfolioHeader">
          <div className="total">{new Intl.NumberFormat('en-US', {style: 'currency', currency: selectedFiat}).format(total)}</div>
          <div className={totalPercentChange < 0 ? "nTotalChange" : "pTotalChange"}>
            {Math.round(totalPercentChange*100)/100}%
          </div>
        </div>
        <div className="portfolioBody">
         {pie}
        </div>
      </div>
    )
}

export default PortfolioContent
