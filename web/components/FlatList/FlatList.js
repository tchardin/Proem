// Horizontal List of currency items with select check box

import React, {Component} from 'react'
import {connect} from 'react-redux'
import Arrow from '../svg/Arrow' // Svg icons
import Radio from '../svg/Radio'
import Candle from '../svg/Candle'
import Curve from '../svg/Curve'
import ListItem from './ListItem'
import s from './styles.css'

import {updateSelected} from '../../market/ids'
import {changeView} from '../../market/ui'

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
    this.props.dispatch(updateSelected('selectedCrypto', id))
  }
  selectFiat({target}) {
    const {value} = target
    this.props.dispatch(updateSelected('selectedFiat', value))
  }
  handleChange(view) {
    this.props.dispatch(changeView(view))
  }
  render() {
    const {position} = this.state
    const {ids, ui} = this.props
    let list = ids.crypto.map(id => (
      <ListItem
        onSelect={this.selectCrypto}
        id={id}
        key={id}
        />
    ))
    let options = ids.fiat.map(id => <option value={id} key={id}>{id}</option>)
    return (
      <div className={s.container}>
        <div className={s.leftInfo}>
          <div className={s.curve}
            onClick={() => this.handleChange('HISTORY')}>
            <Curve color={ui === 'HISTORY' ? "#00CEFF" : "#FFFFFF"} />
          </div>
          <div className={s.candle} 
            onClick={() => this.handleChange('CANDLES')}>
            <Candle color={ui === 'CANDLES' ? "#00CEFF" : "#FFFFFF"} />
          </div>
        </div>
        <div
          className={s.arrowBtn}
          onClick={() => this.scroll(position, position-100, 2000)}>
          <Arrow
            direction="left"
            color="#fff"/>
        </div>
        <ul
          className={s.list}
          ref={ul => this.scrollList = ul}>
          {list}
        </ul>
        <div
          className={s.arrowBtn}
          onClick={() => this.scroll(position, position+100, 2000)}>
          <Arrow
            direction="right"
            color="#fff" />
        </div>
        <div className={s.rightInfo}>
          <div className={s.select}>
            <select
              name="selectedFiat"
              value={ids.selectedFiat}
              onChange={this.selectFiat}>
              {options}
            </select>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {ids, ui} = state
  return {
    ids,
    ui
  }
}

export default connect(mapStateToProps)(FlatListComponent)
