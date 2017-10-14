import {combineReducers} from 'redux'

import {
  INVALIDATE_HISTORY,
  REQUEST_HISTORY,
  RECEIVE_HISTORY,
  INVALIDATE_METRICS,
  REQUEST_METRICS,
  RECEIVE_METRICS,
  REQUEST_CURRENCIES,
  RECEIVE_CURRENCIES,
  SELECT_CURRENCY,
  RECEIVE_ALL_METRICS
} from './actions'

const selectedCurrency = (state = 'BTC', action) => {
  switch (action.type) {
    case SELECT_CURRENCY:
      return action.currency
    default:
      return state
  }
}

const history = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case INVALIDATE_HISTORY:
      return {
        // ...state,
        didInvalidate: true
      }
    case REQUEST_HISTORY:
      return {
        // ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_HISTORY:
      return {
        // ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.results,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const metrics = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case INVALIDATE_METRICS:
      return {
        // ...state,
        didInvalidate: true
      }
    case REQUEST_METRICS:
      return {
        // ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_METRICS:
      return {
        // ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.results[0],
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const currenciesById = (state = {
  isFetching: true
}, action) => {
  switch (action.type) {
    case REQUEST_CURRENCIES:
      return {
        ...state
      }
    case INVALIDATE_METRICS:
    case RECEIVE_METRICS:
    case REQUEST_METRICS:
      return {
        ...state,
        [action.currency]: {
          ...state[action.currency],
          metrics: metrics(state[action.currency], action)
        }
      }
    case INVALIDATE_HISTORY:
    case RECEIVE_HISTORY:
    case REQUEST_HISTORY:
      return {
        ...state,
        [action.currency]: {
          ...state[action.currency],
          history: history(state[action.currency], action)
        }
      }
    case RECEIVE_ALL_METRICS:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}

const allIds = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_CURRENCIES:
      return action.results
    default:
      return state
  }
}

const rootReducer = combineReducers({
  currenciesById,
  allIds,
  selectedCurrency
})

export default rootReducer
