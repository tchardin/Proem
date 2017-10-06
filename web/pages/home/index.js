import React, { Component } from 'react'

// import local css as s.
import s from './styles.css'
// import global css as gs
import gs from './../../styles/grid.css'
import Card from '../../components/Card/Card'

class HomePage extends Component {

  render() {
    return (
      <div className={gs.container}>
        <div className={gs.line}>
          <div className={s.cardContainer}>
            <Card
              target="/bitcoin"
              header="BTC"
              height = "6000"
              />
          </div>
          <div className={s.cardContainer}>
            <Card
              target="/bitcoin"
              header="ETH"
              height = "500"
              />
          </div>
          <div className={s.cardContainer}>
            <Card
              target="/bitcoin"
              header="LTC"
              height = "100"
              />
          </div>
        </div>
      </div>
    )
  }

}

export default HomePage
