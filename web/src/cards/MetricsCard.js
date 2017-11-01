// Card displaying information about specific currencies

import React from 'react'
// local styles
import './Cards.css'

const MetricsCard = ({metrics, selectedFiat, selectedCrypto}) => {
    if (typeof metrics[selectedCrypto] === 'undefined'
    || typeof metrics[selectedCrypto][selectedFiat] === 'undefined'
    || metrics[selectedCrypto][selectedFiat].isFetching) {
      return null
    }
    const {items} = metrics[selectedCrypto][selectedFiat]
    return (
      <div className="metricsCard">
        <div className="cardHeader">
          <h1 className="cardTitleOpen">{items.name}</h1>
        </div>
        <div className="cardBody">
          <div className="list">
            <div className="row">
              <div className="label">Market Cap</div>
              <div className="value">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedFiat }).format(items.market_cap)}
              </div>
            </div>
            <div className="row">
              <div className="label">Volume (24h)</div>
              <div className="value">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedFiat }).format(items['24h_volume'])}
              </div>
            </div>
            <div className="row">
              <div className="label">Available Supply</div>
              <div className="value">{items.available_supply.toLocaleString()} {selectedCrypto}</div>
            </div>
            <div className="row">
              <div className="label">Change (24h)</div>
              <div className={items.percent_change_24h > 0 ? "upValue" : "downValue"}>{items.percent_change_24h}%</div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default MetricsCard
