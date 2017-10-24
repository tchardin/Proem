/**
 * Operations on the metrics entity
 *
 */

const API_ROOT = 'http://proem-io-api-dev.us-east-1.elasticbeanstalk.com'

export const REQUEST_METRICS = 'REQUEST_METRICS'
export const RECEIVE_METRICS = 'RECEIVE_METRICS'

export default (state = {}, action) => {
  const {crypto, fiat, results, receivedAt} = action
  switch (action.type) {
    case REQUEST_METRICS:
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
    case RECEIVE_METRICS:
      return {
        ...state,
        [crypto]: {
          ...state[crypto],
          [fiat]: {
            isFetching: false,
            didInvalidate: false,
            items: results[0],
            lastUpdated: receivedAt
          }
        }
      }
    default:
      return state
  }
}

export const receiveMetrics = (crypto, fiat, results) => ({
  type: RECEIVE_METRICS,
  crypto,
  fiat,
  results,
  receivedAt: Date.now()
})

export const requestMetrics = (crypto, fiat) => ({
  type: REQUEST_METRICS,
  crypto, fiat
})

export const fetchMetrics = (crypto, fiat) => dispatch => {
  dispatch(requestMetrics(crypto, fiat))
  return fetch(`${API_ROOT}/metrics/${crypto}?fiat=${fiat}`)
  .then(res => res.json())
  .then(json => dispatch(receiveMetrics(crypto, fiat, json)))
}
