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
              header="Bitcoin"
              />
          </div>
          <div className={s.cardContainer}>
            <Card
              target="/bitcoin"
              header="Ethereum"
              />
          </div>
          <div className={s.cardContainer}>
            <Card
              target="/bitcoin"
              header="Litecoin"
              />
          </div>
        </div>
      </div>
    )
  }

}

export default HomePage
