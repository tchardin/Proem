/**
 * Creating and updating alerts.
 *
 */

import {omit} from 'lodash'

const ADD_ALERT = 'ADD_ALERT'
const REMOVE_ALERT = 'REMOVE_ALERT'

const removeItem = (array, index) => {
  let newArray = array.slice()
  newArray.splice(index, 1)
  return newArray
}

export default (state = {
  allIds: [],
  alertsByID: {}
}, action) => {
  switch(action.type) {
    case ADD_ALERT:
      const {id, crypto, price} = action
      return {
        allIds: !state.allIds.includes(action.id) ? [...state.allIds, action.id] : [...state.allIds],
        alertsByID: {
          ...state.alertsByID,
          [id]: {
            asset: action.crypto,
            price: action.price
          }
        }
      }
    case REMOVE_ALERT:
      return {
        allIds: removeItem(state.allIds, state.allIds.indexOf(action.id)),
        alertsByID: omit(state.alertsByID, [`${action.id}`])
      }
    default:
      return state
  }
}

export const addAlert = (crypto, price) => {
  return {
    type: ADD_ALERT,
    id: `${crypto}${price}`,
    crypto, price
  }
}

export const removeAlert = id => {
  return {
    type: REMOVE_ALERT,
    id
  }
}
