/**
 * Item for the horizontal List
 *
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import s from './styles.css'
import {fetchMetrics} from '../../market/metrics'

class ListItem extends Component {
  fetchMetricsIfNeeded(crypto, fiat, metrics) {
    if (typeof metrics[crypto] === 'undefined'
    || typeof metrics[crypto][fiat] === 'undefined') {
      this.props.dispatch(fetchMetrics(crypto, fiat))
    }
  }
  componentDidMount() {
    const {id, selectedFiat, metrics} = this.props
    this.fetchMetricsIfNeeded(id, selectedFiat, metrics)
  }
  componentDidUpdate() {
    const {id, selectedFiat, metrics} = this.props
    this.fetchMetricsIfNeeded(id, selectedFiat, metrics)
  }
  render() {
    const {id, metrics, onSelect, selectedCrypto, selectedFiat} = this.props
    if (typeof metrics[id] === 'undefined'
    || typeof metrics[id][selectedFiat] === 'undefined'
    || metrics[id][selectedFiat].isFetching) {
      return null
    }
    const {items} = metrics[id][selectedFiat]
    return (
      <li
        className={id === selectedCrypto ? s.activeItem : s.item}
        key={id}
        onClick={() => onSelect(id)}>
        <label
          className={s.label}>
          <div className={s.id}>{id}</div>
          <div className={s.price}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedFiat }).format(items.price)}</div>
          <div className={items.percent_change_24h > 0 ? s.pChange : s.nChange}>
            {items.percent_change_24h}%
          </div>
        </label>
      </li>
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

export default connect(mapStateToProps)(ListItem)
