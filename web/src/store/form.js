/**
 * Import form bindings
 *
 */

const FORM_UPDATE_VALUE = 'FORM_UPDATE_VALUE'
const FORM_RESET = 'FORM_RESET'
const FORM_DISPLAY = 'FORM_DISPLAY'

const initialState = {
  alerts: {
    display: false,
    amount: '',
    currency: 'BTC'
  },
  portfolio: {
    display: false,
    amount: '',
    date: '',
    currency: 'BTC'
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FORM_DISPLAY:
    case FORM_UPDATE_VALUE:
      return {
        ...state,
        [action.card]: form(state[action.card], action)
      }
    case FORM_RESET:
      return initialState
    default:
      return state
  }
}

const form = (state, action) => {
  switch (action.type) {
    case FORM_DISPLAY:
      return {
        ...state,
        display: !state.display
      }
    case FORM_UPDATE_VALUE:
      return {
        ...state,
        [action.name]: action.value
      }
    default:
      return state
  }
}

export const updateForm = (card, name, value) => ({
  type: FORM_UPDATE_VALUE,
  card, name, value
})

export const resetForm = card => ({
  type: FORM_RESET,
  card
})

export const displayForm = card => ({
  type: FORM_DISPLAY,
  card
})
