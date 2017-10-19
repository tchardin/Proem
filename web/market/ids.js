/**
 * Cache data when necessary
 *
 */

 const API_ROOT = 'http://proem-io-api-dev.us-east-1.elasticbeanstalk.com'

const REQUEST_IDS = 'REQUEST_IDS'
const RECEIVE_IDS = 'RECEIVE_IDS'
const UPDATE_SELECTED = 'UPDATE_SELECTED'

export default (state = {
  isFetching: true,
  crypto: [],
  fiat: [],
  selectedFiat: 'USD',
  selectedCrypto: 'BTC'
}, action) => {
  switch(action.type) {
    case REQUEST_IDS:
      return {
        ...state
      }
    case RECEIVE_IDS:
      return {
        ...state,
        isFetching: false,
        crypto: action.results.crypto,
        fiat: action.results.fiat
      }
    case UPDATE_SELECTED:
      return {
        ...state,
        [action.selectedItem]: action.value
      }
    default:
      return state
  }
}

export const updateSelected = (selectedItem, value) => ({
  type: UPDATE_SELECTED,
  selectedItem, value
})

// Fetch currencies supported by the API.
export const receiveIds = results => ({
  type: RECEIVE_IDS,
  results
})

export const requestIds = () => ({
  type: REQUEST_IDS
})

const fetchIds = () => dispatch => {
  dispatch(requestIds())
  return fetch(`${API_ROOT}/supported`)
    .then(response => response.json())
    .then(json => dispatch(receiveIds(json)))
}

// Fetches array of supported currencies unless it is cached.
export const loadIds = () => (dispatch, getState) => {
  const currencies = getState().ids.crypto
  if (currencies.length) {
    return null
  }
  return dispatch(fetchIds())
}
