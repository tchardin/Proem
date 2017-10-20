import React, {Component} from 'react'
import {connect} from 'react-redux'
import s from './styles.css'

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
    let items = allIds.map(id => (
      <div className={s.portfolioItem}>
        <div className={s.assetTitle}>{id}</div>
        <div className={s.assetShare}>53%</div>
      </div>
    ))
    return (
      <div className={s.portfolioContainer}>
        <div className={s.portfolioHeader}>
          <div className={s.total}>$200.89</div>
          <div className={s.totalChange}>+2.5%</div>
        </div>
        <div className={s.portfolioBody}>
         {items}
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
