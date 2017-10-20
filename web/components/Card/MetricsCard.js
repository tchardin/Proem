// Card displaying information about specific currencies

import React, { Component } from 'react'
import {connect} from 'react-redux'
import Button from '../Button/Button'
// local styles
import s from './styles.css'

class MetricsCard extends Component {
  handleSubmit() {
  }
  handleCancel() {

  }
  render() {
    const {metrics, selectedFiat, selectedCrypto} = this.props
    if (typeof metrics[selectedCrypto] === 'undefined'
    || typeof metrics[selectedCrypto][selectedFiat] === 'undefined'
    || metrics[selectedCrypto][selectedFiat].isFetching) {
      return null
    }
    const {items} = metrics[selectedCrypto][selectedFiat]
    return (
      <div className={s.metricsCard}>
        <div className={s.cardHeader}>
          <h1 className={s.cardTitleOpen}>METRICS</h1>
        </div>
        <div className={s.cardBody}>
          <div className={s.list}>
            <div className={s.row}>
              <div className={s.label}>Market Cap</div>
              <div className={s.value}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedFiat }).format(items.market_cap)}
              </div>
            </div>
            <div className={s.row}>
              <div className={s.label}>Volume (24h)</div>
              <div className={s.value}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedFiat }).format(items['24h_volume'])}
              </div>
            </div>
            <div className={s.row}>
              <div className={s.label}>Available Supply</div>
              <div className={s.value}>{items.available_supply.toLocaleString()} {selectedCrypto}</div>
            </div>
            <div className={s.row}>
              <div className={s.label}>Change (24h)</div>
              <div className={s.value}>{items.percent_change_24h}%</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {metrics, ids} = state
  const {selectedFiat, selectedCrypto} = ids
  return {
    metrics,
    selectedFiat,
    selectedCrypto
  }
}

export default connect(mapStateToProps)(MetricsCard)
