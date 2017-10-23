import React, {Component} from 'react'
import s from './styles.css'
// import delete alert
import Cross from '../svg/Cross'

const AlertItem = ({alerts, id, onDelete}) => {
  return (
    <div className={s.alertContainer}>
      <div
        className={s.alertCross}
        onClick={onDelete}>
        <Cross
          color="#00CEFF"
          size="14px"
          direction="cancel" />
      </div>
      <div className={s.alertInfo}>
        <div className={s.alertLabel}>
          {alerts[id].asset}
        </div>
        <div className={s.alertPrice}>
          {alerts[id].price}
        </div>
      </div>
    </div>
  )
}

export default AlertItem
