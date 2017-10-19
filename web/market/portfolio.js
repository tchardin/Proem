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
            [action.date]: action.amount
          }
        }
      }
    default:
      return state
  }
}

export const updatePortfolio = (currency, amount, date) => ({
  type: UPDATE_PORTFOLIO,
  currency, amount, date
})
