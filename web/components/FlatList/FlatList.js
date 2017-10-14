// Horizontal List of currency items with select check box

import React, {Component} from 'react'
import Arrow from '../svg/Arrow' // Svg icons
import Radio from '../svg/Radio'
import s from './styles.css'

class FlatListComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      position: 0,
      selectedFiat: 'USD'
    }
    this.selectItem = this.selectItem.bind(this)
    this.scroll = this.scroll.bind(this)
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
  selectItem(e) {
    this.props.onSelectItem(e)
  }
  handleChange({target}) {
    this.setState({
      [target.name]: target.value
    })
  }
  render() {
    const {position, selectedFiat} = this.state
    const {items, ids, selectedItem} = this.props
    let list = ids.map(id => (
      <li
        className={id === selectedItem ? s.activeItem : s.item}
        key={id}
        onClick={() => this.selectItem(id)}>
        <label
          className={s.label}>
          <div className={s.id}>{id}</div>
          <div className={s.price}>{items[id].metrics.items.price_usd}</div>
          <div
            className={items[id].metrics.items.percent_change_24h > 0 ? s.pChange : s.nChange}>
            {items[id].metrics.items.percent_change_24h}%
          </div>
        </label>
      </li>
    ))
    const fiat = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD', 'NZD', 'ZAR', 'CNY']
    let options = fiat.map(id => <option value={id} key={id}>{id}</option>)
    return (
      <div className={s.container}>
        <div className={s.leftInfo}>
          {this.props.share}%
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
              value={this.state.selectedFiat}
              onChange={this.handleChange}>
              {options}
            </select>
          </div>
        </div>
      </div>
    )
  }
}

export default FlatListComponent
