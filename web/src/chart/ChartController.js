// Horizontal List of currency items with select check box

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Arrow from '../components/svg/Arrow' // Svg icons
import Candle from '../components/svg/Candle'
import Curve from '../components/svg/Curve'
import ListItem from './ListItem'
import './Chart.css'

import {updateSelected, updateGroup} from '../store/ids'
import {toggleChart} from '../store/ui'

const colorScale = ["#FFF500", "#FF00C4", "#FFA700", "#0089FF", "#B100FF"]

class FlatListComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      position: 0,
    }
    this.scroll = this.scroll.bind(this)
    this.selectCrypto = this.selectCrypto.bind(this)
    this.selectFiat = this.selectFiat.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  scroll(start, end, duration) {
    const {scrollList} = this
    let delta = end - start
    let startTime
		  if (window.performance && window.performance.now) {
			  startTime = performance.now()
		  }
		  else if (Date.now) {
			  startTime = Date.now()
		  }
		  else {
			  startTime = new Date().getTime()
		  }
    const easeOutExpo = (x, t, b, c, d) => {
		   return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	  }
    const tweenLoop = (time) => {
      let t = !time ? 0 : time - startTime
      let factor = easeOutExpo(null, t, 0, 1, duration)
      scrollList.scrollLeft = start + delta * factor
      if (t < duration && scrollList.scrollLeft != end)
        requestAnimationFrame(tweenLoop)
    }
    tweenLoop()
    this.setState({
      position: end
    })
  }
  selectCrypto(id) {
    this.props.updateSelected('selectedCrypto', id)
  }
  selectFiat({target}) {
    const {value} = target
    this.props.updateSelected('selectedFiat', value)
  }
  handleChange(view) {
    this.props.toggleChart(view)
  }
  render() {
    const {position} = this.state
    const {ids, ui, allIds, assets, updateGroup, metrics} = this.props
    const {selectedFiat, selectedGroup} = ids
    let list
    let selectedShare
    if (ui.portfolio && allIds.length) {
      list = allIds.map(id => (
        <ListItem
          onSelect={updateGroup}
          selection={selectedGroup}
          id={id}
          key={id}
          color={colorScale[allIds.indexOf(id)]}
          />
      ))
      // Calculate totals for each asset
      let allBalances = allIds.map(id =>
        assets[id].balance * metrics[id][selectedFiat].items.price)

      // Calculate the total value of the portfolio
      let total = allBalances.reduce((a, b) => a + b, 0)

      // Calculate the percent share of total portfolio for each asset
      let sharesById = selectedGroup.map(id => {
        return assets[id].balance*metrics[id][selectedFiat].items.price/total
      })
      selectedShare = sharesById.reduce((a, b) => a + b, 0) || 0
    } else {
      list = ids.crypto.map(id => (
        <ListItem
          onSelect={this.selectCrypto}
          selection={ids.selectedCrypto}
          id={id}
          key={id}
          />
      ))
    }
    let options = ids.fiat.map(id => <option value={id} key={id}>{id}</option>)
    return (
      <div className="controlContainer">
        {
          !ui.portfolio ? (
            <div className="leftInfo">
              <div className="curve"
                onClick={() => this.handleChange('LINE')}>
                <Curve color={ui.chart === 'LINE' ? "#00CEFF" : "#FFFFFF"} />
              </div>
              <div className="candle"
                onClick={() => this.handleChange('CANDLES')}>
                <Candle color={ui.chart === 'CANDLES' ? "#00CEFF" : "#FFFFFF"} />
              </div>
            </div>
          ) : (
            <div className="leftInfo">
             {selectedShare ? Math.round(selectedShare*10000)/100 : 0}%
            </div>
          )
        }
        <div className="centerControl">
          <div
            className="arrowBtn"
            onClick={() => this.scroll(position, position-100, 2000)}>
            <Arrow
              direction="left"
              color="#fff"/>
          </div>
          <ul
            className="controlList"
            ref={ul => this.scrollList = ul}>
            {list}
          </ul>
          <div
            className="arrowRightBtn"
            onClick={() => this.scroll(position, position+100, 2000)}>
            <Arrow
              direction="right"
              color="#fff" />
          </div>
        </div>
        <div className="rightInfo">
          <div className="fiatSelect">
            <select
              name="selectedFiat"
              value={ids.selectedFiat}
              onChange={this.selectFiat}
              disabled={ui.portfolio}>
              {options}
            </select>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {ids, ui, portfolio, metrics} = state
  const {allIds, assets} = portfolio
  return {
    ids,
    ui,
    allIds,
    assets,
    metrics
  }
}

export default connect(mapStateToProps, {
  updateGroup,
  updateSelected,
  toggleChart
})(FlatListComponent)
