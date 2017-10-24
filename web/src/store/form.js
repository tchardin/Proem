/**
 * Import form bindings
 *
 */

const FORM_UPDATE_VALUE = 'FORM_UPDATE_VALUE'
const FORM_RESET = 'FORM_RESET'

const initialState = {
  amount: '',
  date: '',
  currency: 'BTC'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FORM_UPDATE_VALUE:
      return {
        ...state,
        [action.name]: action.value
      }
    case FORM_RESET:
      return initialState
    default:
      return state
  }
}

export const  update = (name, value) => ({
  type: FORM_UPDATE_VALUE,
  name, value
})

export const reset = () => ({
  type: FORM_RESET
})
