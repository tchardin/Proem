/**
 * User portfolio data operations
 *
 */
const API_ROOT = 'http://proem-io-api-dev.us-east-1.elasticbeanstalk.com'

const UPDATE_PORTFOLIO = 'UPDATE_PORTFOLIO'
const ERROR_PORTFOLIO = 'ERROR_PORTFOLIO'
const REQUEST_P_CHART = 'REQUEST_P_CHART'
const RECEIVE_P_CHART = 'RECEIVE_P_CHART'

const initialState = {
  allIds: [],
  assets: {},
  charts: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PORTFOLIO:
      const {currency, date, newBalance} = action
      return {
        ...state,
        allIds: state.allIds.includes(currency) ? [...state.allIds] : state.allIds.concat(currency),
        assets: {
          ...state.assets,
          [currency]: {
            balance: newBalance,
            transactions: transaction(state.assets[currency], action)
          }
        }
      }
    case REQUEST_P_CHART:
      const {crypto, fiat} = action
      return {
        ...state,
        charts: {
          ...state.charts,
          [crypto]: {
            ...state.charts[crypto],
            [fiat]: {
              isFetching: true
            }
          }
        }
      }
    case RECEIVE_P_CHART:
      const {pChart} = action
      return {
        ...state,
        charts: {
          ...state.charts,
          [crypto]: {
            ...state.charts[crypto],
            [fiat]: {
              isFetching: false,
              chart: pChart
            }
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

const requestPChart = (crypto, fiat) => ({
  type: REQUEST_P_CHART,
  crypto, fiat
})

const receivePChart = (pChart, crypto, fiat) => ({
  type: RECEIVE_P_CHART,
  pChart, crypto, fiat
})

export const fetchPChart = (crypto, fiat, transactions) => dispatch => {
  const {date} = transactions[0]
  dispatch(requestPChart(crypto, fiat))
  return fetch(`${API_ROOT}/${crypto}?date_from=${date}&fiat=${fiat}`)
  .then(response => response.json())
  .then(json => {
    let balance = 0
    let pChart = json.map(day => {
      transactions.forEach(t => {
        if (t.date === new Date(day.date)) {
          return balance += t.amount
        }})
      return {
        date: day.date,
        price: balance
      }
    })
    dispatch(receivePChart(pChart, crypto, fiat))
  })
}
