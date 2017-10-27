/**
 * Item for the horizontal Controller List
 *
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import './Chart.css'
import {fetchMetrics} from '../store/metrics'

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
    const {id, metrics, onSelect, selection, selectedFiat} = this.props
    if (typeof metrics[id] === 'undefined'
    || typeof metrics[id][selectedFiat] === 'undefined'
    || metrics[id][selectedFiat].isFetching) {
      return null
    }
    const {items} = metrics[id][selectedFiat]
    let selectedArray = Array.isArray(selection) ? selection : [selection]
    return (
      <li
        className={selectedArray.includes(id) ? "activeControlItem" : "controlItem"}
        key={id}
        onClick={() => onSelect(id)}>
        <label
          className="controlItemlabel">
          <div className="controlId">{id}</div>
          <div className="controlPrice">{new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedFiat }).format(items.price)}</div>
          <div className={items.percent_change_24h > 0 ? "pChange" : "nChange"}>
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
