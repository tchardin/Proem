// Horizontal List of currency items with select check box

import React, {Component} from 'react'
import Arrow from '../svg/Arrow' // Svg icons
import Radio from '../svg/Radio'
import s from './styles.css'

class FlatListComponent extends Component {
  constructor(props) {
    super(props)
    this.selectItem = this.selectItem.bind(this)
    this.scroll = this.scroll.bind(this)
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
    const easeOutCubic = (x, t, b, c, d) => {
      return c*((t=t/d-1)*t*t + 1) + b;
    }
    const tweenLoop = (time) => {
      let t = !time ? 0 : time - startTime
      let factor = easeOutCubic(null, t, 0, 1, duration)
      scrollList.scrollLeft = start + delta * factor
      if (t < duration && scrollList.scrollLeft != end)
        requestAnimationFrame(tweenLoop)
    }
    tweenLoop()
  }
  selectItem(e) {
    this.props.onSelectItem(e)
  }
  render() {
    let list = this.props.items.map(item => (
      <li
        className={s.item}
        key={item.id}
        onClick={() => this.selectItem(item)}>
        <label
          className={s.label}>
          <div className={s.id}>{item.id}</div>
          <div className={s.price}>{item.info[0].value}</div>
          <div className={s.change}>{item.info[1].value}</div>
        </label>
        <Radio
          isActive={this.props.selectedItems.includes(item)} />
      </li>
    ))
    return (
      <div className={s.container}>
        <div className={s.leftInfo}>
          {this.props.share}%
        </div>
        <div
          className={s.arrowBtn}
          onClick={() => this.scroll(500, 0, 2000)}>
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
          onClick={() => this.scroll(0, 500, 2000)}>
          <Arrow
            direction="right"
            color="#fff" />
        </div>
        <div className={s.rightInfo}>
          {this.props.fiat}
        </div>
      </div>
    )
  }
}

export default FlatListComponent
