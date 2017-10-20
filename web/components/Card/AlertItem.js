import React, {Component} from 'react'
import {connect} from 'react-redux'
import s from './styles.css'
// import delete alert

class AlertItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
    this.handleHover = this.handleHover.bind(this)
  }
  handleHover() {
    this.setState({
      hover: true
    })
  }
  render() {
    const {alerts, id, fiat, metrics} = this.props
    return (
      <div className={s.alertContainer}>
        <div className={s.alertLabel}>{alerts[id].crypto} {metrics[alerts[id].crypto][fiat].items.name}</div>
        <div className={s.alertPrice}>{alerts[id].price}</div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {alerts, metrics, ids} = state
  const {alertsByID} = alerts
  const {selectedFiat} = ids
  return {
    alerts: alertsByID,
    fiat: selectedFiat,
    metrics
  }
}

export default connect(mapStateToProps)(AlertItem)
