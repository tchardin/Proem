/*
 * Experimenting with data flows here
 * will gradually remove state mutations from components to
 * user central Redux state instead. Beginning with API calls.
 */
 const API_ROOT = 'http://proem-io-api-dev.us-east-1.elasticbeanstalk.com'

export const REQUEST_CURRENCIES = 'REQUEST_CURRENCIES'
export const RECEIVE_CURRENCIES = 'RECEIVE_CURRENCIES'
export const SELECT_CURRENCY = 'SELECT_CURRENCY'
export const REQUEST_HISTORY = 'REQUEST_HISTORY'
export const RECEIVE_HISTORY = 'RECEIVE_HISTORY'
export const REQUEST_METRICS = 'REQUEST_METRICS'
export const RECEIVE_METRICS = 'RECEIVE_METRICS'
export const INVALIDATE_HISTORY = 'INVALIDATE_HISTORY'
export const INVALIDATE_METRICS ='INVALIDATE_METRICS'
export const RECEIVE_ALL_METRICS = 'RECEIVE_ALL_METRICS'

// Fetch historical data for a specific currency
export const invalidateHistory = currency => ({
  type: INVALIDATE_HISTORY,
  currency
})

export const receiveHistory = (currency, results) => ({
  type: RECEIVE_HISTORY,
  currency,
  results,
  receivedAt: Date.now()
})

export const requestHistory = currency => ({
  type: REQUEST_HISTORY,
  currency
})

const fetchHistory = currency => dispatch => {
  dispatch(requestHistory(currency))
  return fetch(`${API_ROOT}/${currency}`)
    .then(response => response.json())
    .then(json => dispatch(receiveHistory(currency, json)))
}

const shouldFetchHistory = (state, currency) => {
  const history = state.currenciesById[currency].history
  if (typeof history === 'undefined') {
    return true
  } else if (currencies.isFetching) {
    return false
  } else {
    return currencies.didInvalidate
  }
}

export const fetchHistoryIfNeeded = currency => (dispatch, getState) => {
    if(shouldFetchHistory(getState(), currency)) {
      return dispatch(fetchHistory(currency))
    }
}

export const invalidateMetrics = currency => ({
  type: INVALIDATE_METRICS,
  currency
})

export const receiveMetrics = (currency, results) => ({
  type: RECEIVE_METRICS,
  currency,
  results,
  receivedAt: Date.now()
})

export const requestMetrics = currency => ({
  type: REQUEST_METRICS,
  currency
})

export const receiveAllMetrics = () => ({
  type: RECEIVE_ALL_METRICS
})

const fetchMetrics = currency => dispatch => {
  dispatch(requestMetrics(currency))
  return fetch(`${API_ROOT}/metrics/${currency}`)
  .then(res => res.json())
  .then(json => dispatch(receiveMetrics(currency, json)))
}


// Select
export const selectCurrency = currency => ({
  type: SELECT_CURRENCY,
  currency
})

// Fetch currencies supported by the API.
export const receiveCurrencies = results => ({
  type: RECEIVE_CURRENCIES,
  results
})

export const requestCurrencies = () => ({
  type: REQUEST_CURRENCIES
})

const fetchCurrencies = () => dispatch => {
  dispatch(requestCurrencies())
  return fetch(`${API_ROOT}/supported`)
    .then(response => response.json())
    .then(json => dispatch(receiveCurrencies(json)))
}
// Fetches array of supported currencies unless it is cached.
export const loadCurrencies = () => (dispatch, getState) => {
  const currencies = getState().allIds
  if (currencies.length) {
    return null
  }
  return dispatch(fetchCurrencies())
  .then(res => {
    const metrics = res.results.map(currency => dispatch(fetchMetrics(currency)))
    const history = res.results.map(currency => dispatch(fetchHistory(currency)))
    return Promise.all(metrics.concat(history))
    .then(() => dispatch(receiveAllMetrics()))
  })
}
