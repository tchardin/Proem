/**
 * Creating and updating alerts.
 *
 */

const ADD_ALERT = 'ADD_ALERT'
const REMOVE_ALERT = 'REMOVE_ALERT'

const createAlert = (state, action) => {
  const {payload} = action
  const {alertId, crypto, price} = payload
  return {
    ...state,
    [alertId]: payload
  }
}

export default (state = {
  allIds: [],
  alertsByID: {}
}, action) => {
  switch(action.type) {
    case ADD_ALERT:
      return {
        allIds: [...state.allIds, action.payload.alertId],
        alertsByID: createAlert(state.alertsByID, action)
      }
    default:
      return state
  }
}

export const addAlert = (crypto, price) => {
  const alertId = generateId()
  return {
    type: ADD_ALERT,
    payload: {
      alertId,
      crypto,
      price
    }
  }
}

const generateId = () => {
  return Math.floor(Math.random()*1000)
}
