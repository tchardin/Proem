/**
 * User portfolio data operations
 *
 */

const UPDATE_PORTFOLIO = 'UPDATE_PORTFOLIO'
const ERROR_PORTFOLIO = 'ERROR_PORTFOLIO'

const initialState = {
  allIds: [],
  assets: {}
}

export default (state = initialState, action) => {
  const {currency, date, newBalance} = action
  switch (action.type) {
    case UPDATE_PORTFOLIO:
      return {
        allIds: state.allIds.includes(currency) ? [...state.allIds] : state.allIds.concat(currency),
        assets: {
          ...state.assets,
          [currency]: {
            balance: newBalance,
            transactions: transaction(state.assets[currency], action)
          }
        }
      }
    case ERROR_PORTFOLIO:
      return state
    default:
      return state
  }
}

const transaction = (state, action) => {
  const {date, amount, currency} = action
  if (typeof state === 'undefined') {
    return [{date, amount}]
  }
  return state.transactions.concat({date, amount})
}

const updatePortfolio = (currency, amount, date, newBalance) => ({
  type: UPDATE_PORTFOLIO,
  currency, amount, date, newBalance
})

const errorPortfolio = currency => {
  type: ERROR_PORTFOLIO,
  currency
}

export const newTransaction = (currency, amount, date) => (dispatch, getState) => {
  const {assets} = getState().portfolio
  const currentBalance = assets[currency] ? assets[currency].balance : 0
  const newBalance = currentBalance + amount
  if (newBalance < 0) {
    dispatch(errorPortfolio(currency))
  } else {
    dispatch(updatePortfolio(currency, amount, date, newBalance))
  }
}
