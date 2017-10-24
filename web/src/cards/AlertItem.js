import React from 'react'
import './Cards.css'
// import delete alert
import Cross from '../components/svg/Cross'

const AlertItem = ({alerts, id, onDelete}) => {
  return (
    <div className="alertContainer">
      <div
        className="alertCross"
        onClick={onDelete}>
        <Cross
          color="#00CEFF"
          size="14px"
          direction="cancel" />
      </div>
      <div className="alertInfo">
        <div className="alertLabel">
          {alerts[id].asset}
        </div>
        <div className="alertPrice">
          {alerts[id].price}
        </div>
      </div>
    </div>
  )
}

export default AlertItem
