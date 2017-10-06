// This is an example of a react component that can be reused throughout a site

import React, { Component } from 'react'
import {VictoryLine} from 'victory'
import Link from './../Link/Link'
// local styles
import s from './styles.css'

const data = [
  {time: 0, price: 2842},
  {time: 1, price: 2480},
  {time: 2, price: 3238},
  {time: 3, price: 3892},
  {time: 4, price: 1209}
]

class CardComponent extends Component {
  render() {
    return (
      <div className={s.card}>
        <Link to={this.props.target}>
          <h1 className={s.cardHeader}>{this.props.header}</h1>
        </Link>
        <VictoryLine
            interpolation={"natural"}
            data={data}
            domain={{x: [0, 4], y: [0, 4000]}}
            style={{data: {stroke: 'black'}}}
            padding={0}
            x="time"
            y="price"
          />
      </div>
    )
  }
}

export default CardComponent
