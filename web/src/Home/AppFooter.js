/**
 * Permanent footer throughout the app
 *
 */

/* @flow */

import React from 'react'
import styled from 'styled-components'
import history from '../history'

import {connect} from 'react-redux'
import {toggleChart, updateSelected, updateGroup} from '../store/ui'

import ListItem from './ListItem'
import Arrow from '../svg/Arrow'
import Curve from '../svg/Curve'
import Candle from '../svg/Candle'

  const Footer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    background color: transparent;
    padding: 0.5em 1em;
  `

  const LeftControls = styled.div`
    font-family: 'Gotham';
    font-weight: bold;
    font-size: 3em;
    color: white;
    user-select: none;
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: flex-start;
  `

  const RightControls = styled.div`
    font-family: 'Gotham';
    font-weight: bold;
    font-size: 3em;
    color: white;
    user-select: none;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.5em;
  `
  const CenterControls = styled.div`
    display: flex;
    align-items: center;
    width: 70%;
    display: flex;
    flex: 2;
    padding: 0 3em 0 3em;
  `

  const LeftBtn = styled.div`
    cursor: pointer;
    padding: 0.5em;
  `

  const RightBtn = styled.div`
    transform: rotate(180deg) translateY(4px);
    cursor: pointer;
    padding: 0.5em;
  `

  const ControlList = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
    white-space: nowrap;
    font-family: 'Gotham';
    font-size: 1em;
    line-height: 1.35em;
  `

  const FiatSelector = styled.div`
    display: inline-block;
  	max-width: 100%;
  	position: relative;
  	vertical-align: top;
  `

  const Selector = styled.select`
    moz-appearance: none;
    -webkit-appearance: none;
    align-items: center;
    border: 1px solid transparent;
    box-shadow: none;
    display: inline-flex;
    justify-content: flex-start;
    position: relative;
    vertical-align: top;
    background-color: transparent;
    color: white;
    cursor: pointer;
    display: block;
    font-size: 1em;
    font-weight: bold;
    max-width: 100%;
    outline: none;
  `

  const CurveIcon = styled.span`
    cursor: pointer;
    padding: 0.25em;
  `

  const CandleIcon = styled.span`
    cursor: pointer;
    padding: 0.25em;
  `

  const colorScale = ["#FFF500", "#FF00C4", "#FFA700", "#0089FF", "#B100FF"]

class AppFooter extends React.Component {
  state = {
    position: 0
  }
  scroll = (start, end, duration) => {
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

  selectFiat = ({target}) => {
    const {value, name} = target
    const {selectedCoin, updateSelected, view} = this.props
    const path = view.toLowerCase()
    updateSelected(name, value)
    history.push(`/${path}/${selectedCoin}/${value}`)
  }
  selectCoin = coin =>
    this.props.updateSelected('coin', coin)

  toggleView = view => {
    const {selectedCoin, selectedFiat} = this.props
    toggleChart(view)
    history.push(`/${view.toLowerCase()}/${selectedCoin}/${selectedFiat}`)
  }

  render() {
    const {
      selectedCoin,
      selectedFiat,
      selectedGroup,
      closed,
      toggleChart,
      view,
      portfolio,
      metrics,
      group
    } = this.props
    const {position} = this.state
    return (
      <Footer>
        {closed &&
          <LeftControls>
            <CurveIcon
              onClick={() => this.toggleView('HISTORY')}>
              <Curve color={view === 'HISTORY' ? "#00CEFF" : "#FFFFFF"} />
            </CurveIcon>
            <CandleIcon
              onClick={() => this.toggleView('CANDLES')}>
              <Candle color={view === 'CANDLES' ? "#00CEFF" : "#FFFFFF"} />
            </CandleIcon>
          </LeftControls>}
        <CenterControls>
          <LeftBtn
            onClick={() => this.scroll(position, position-100, 2000)}>
            <Arrow
              color="#fff"
              size="25px"/>
          </LeftBtn>
          <ControlList
            innerRef={div => {this.scrollList = div}}>
            {this.props.assets.map((a, i) => (
              <ListItem
                portfolio={portfolio}
                item={a.metrics[0]}
                key={i}
                chartView={view}
                selected={portfolio ? selectedGroup : selectedCoin}
                selectedFiat={selectedFiat}
                handleSelect={portfolio ? this.props.updateGroup : this.selectCoin}
                metrics={metrics}
                color={portfolio && group.length ? colorScale[i] : false}/>
            ))}
          </ControlList>
          <RightBtn
            onClick={() => this.scroll(position, position+100, 2000)}>
            <Arrow
              color="#fff"
              size="25px"/>
          </RightBtn>
        </CenterControls>
        <RightControls>
          <FiatSelector>
            <Selector
              name="fiat"
              value={selectedFiat}
              onChange={this.selectFiat}>
              {this.props.fiats.map(
                f => <option value={f} key={f}>{f}</option>)}
            </Selector>
          </FiatSelector>
        </RightControls>
      </Footer>
    )
  }
}

const mapStateToProps = state => ({
  selectedFiat: state.routing.variables.fiat,
  selectedCoin: state.routing.variables.coin,
  selectedGroup: state.ui.selectedGroup,
  group: state.routing.variables.group
})

export default connect(mapStateToProps, {
  toggleChart,
  updateSelected,
  updateGroup
})(AppFooter)
