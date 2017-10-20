/**
 * User portfolio data operations
 *
 */

const UPDATE_PORTFOLIO = 'UPDATE_PORTFOLIO'

const initialState = {
  allIds: [],
  assets: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PORTFOLIO:
      return {
        allIds: state.allIds.concat(action.currency),
        assets: {
          ...state.assets,
          [action.currency]: {
            ...state.assets[action.currency],
            [action.date]: transaction(action)
          }
        }
      }
    default:
      return state
  }
}

const transaction = action => {
  const {date, amount} = action
  return {
    date,
    amount
  }
}

export const updatePortfolio = (currency, amount, date) => ({
  type: UPDATE_PORTFOLIO,
  currency, amount, date
})
