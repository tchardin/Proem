// This is an example of a react component that can be reused throughout a site

import React, { Component } from 'react'
import {VictoryLine} from 'victory'
import Link from './../Link/Link'
// local styles
import s from './styles.css'
import axios from 'axios'

import Request from 'react-http-request';


const data = [
  {time: 0, price: 2842.44},
  {time: 1, price: 2480.99},
  {time: 2, price: 3238},
  {time: 3, price: 3892},
  {time: 4, price: 1209}
]


class CardComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
        data: [],
        height: 1
    };
}

  componentDidMount(){
    var self = this;
    axios.get("http://127.0.0.1:5000/" + this.props.ticker).then((response) => {
        self.setState({
          // parseFloat(a.Mid)
          data: response.data.map((a, index) => {return ({time: index, price: parseFloat(a.Mid)})}),

        })
        self.setState({

          height: Math.max.apply(Math,this.state.data.map(function(o){return o.price;}))

        })
      }).catch((error) => {
        console.log('error: ' + error)
      });
    }

  render() {
    return (
      <div className={s.card}>
        <Link to={this.props.target}>
          <h1 className={s.cardHeader}>{this.props.header}</h1>
        </Link>
        <VictoryLine
            interpolation={"natural"}
            data={this.state.data}
            domain={{x: [0, this.state.data.length], y: [-this.state.height/2, this.state.height]}}
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