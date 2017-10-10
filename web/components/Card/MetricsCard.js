// Card displaying information about specific currencies

import React, { Component } from 'react'
// local styles
import s from './styles.css'


class CardComponent extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit() {

  }
  render() {
    let list = this.props.item.info.map(i => (
      <div className={s.row} key={i.field}>
        <div className={s.label}>{i.field}</div>
        <div className={s.value}>{i.value}</div>
      </div>
    ))
    return (
      <div className={s.card}>
        <h1 className={s.cardHeader}>{this.props.item.name}</h1>
        <div className={s.cardBody}>
          {list}
          <div className={s.btnContainer}>
            <button
              className={s.btn}
              onClick={() => this.handleSubmit()}>Add To portfolio</button>
          </div>
        </div>
      </div>
    )
  }
}

export default CardComponent
