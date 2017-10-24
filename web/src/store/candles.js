/**
 * Getting candles cause you never know
 *
 */

const API_ROOT = 'http://proem-io-api-dev.us-east-1.elasticbeanstalk.com'

export const REQUEST_CANDLES = 'REQUEST_CANDLES'
export const RECEIVE_CANDLES = 'RECEIVE_CANDLES'

export const getCandles = state => state.candles

export default (state={}, action) => {
  const {crypto, fiat, results, receivedAt} = action
  switch(action.type) {
    case REQUEST_CANDLES:
      return {
        ...state,
        [crypto]: {
          ...state[crypto],
          [fiat]: {
            isFetching: true,
            didInvalidate: false
          }
        }
      }
    case RECEIVE_CANDLES:
      return {
        ...state,
        [crypto]: {
          ...state[crypto],
          [fiat]: {
            isFetching: false,
            didInvalidate: false,
            items: results,
            lastUpdated: receivedAt
          }
        }
      }
    default:
      return state
  }
}

export const fetchCandles = (crypto, fiat) => dispatch => {
  dispatch(requestCandles(crypto, fiat))
  return fetch(`${API_ROOT}/candles/${crypto}?interval=1D&fiat=${fiat}`)
    .then(response => response.json())
    .then(json => dispatch(receiveCandles(crypto, fiat, json)))
}

export const receiveCandles = (crypto, fiat, results) => ({
  type: RECEIVE_CANDLES,
  crypto,
  fiat,
  results,
  receivedAt: Date.now()
})

export const requestCandles = (crypto, fiat) => ({
  type: REQUEST_CANDLES,
  crypto, fiat
})
