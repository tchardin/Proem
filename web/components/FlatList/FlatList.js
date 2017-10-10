// Horizontal List of currency items with select check box

import React, {Component} from 'react'
import Arrow from '../svg/Arrow' // Svg icons
import Radio from '../svg/Radio'
import s from './styles.css'

class FlatListComponent extends Component {
  constructor(props) {
    super(props)
    this.scrollTo = this.scrollTo.bind(this)
    this.selectItem = this.selectItem.bind(this)
  }
  // TODO: scroll function to scroll through list if we add more currencies
  scrollTo(e) {
    // const easeOutCubic = function (x, t, b, c, d) {
		// return c*((t=t/d-1)*t*t + 1) + b;
	  // }
    e === 'left' ? this.scrollList.scrollLeft = 0 : this.scrollList.scrollLeft = 500
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
        <div
          className={s.arrowBtn}
          onClick={() => this.scrollTo('left')}>
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
          onClick={() => this.scrollTo('right')}>
          <Arrow
            direction="right"
            color="#fff" />
        </div>
      </div>
    )
  }
}

export default FlatListComponent
