/**
 * Operations on the history entity
 *
 */
 import {createSelector} from 'reselect'
 const API_ROOT = 'http://proem-io-api-dev.us-east-1.elasticbeanstalk.com'

 export const REQUEST_HISTORY = 'REQUEST_HISTORY'
 export const RECEIVE_HISTORY = 'RECEIVE_HISTORY'

 export const getHistory = state => state.history
 export const getSelectedFiat = state => state.ids.selectedFiat
 export const getSelectedCrypto = state => state.ids.selectedCrypto

 export const getSelectedHistory = createSelector(
   [getHistory, getSelectedFiat, getSelectedCrypto],
   (history, selectedFiat, selectedCrypto) => {
     return history[selectedCrypto][selectedFiat]
   }
 )

 export default (state = {}, action) => {
   const {crypto, fiat, results, receivedAt} = action
   switch (action.type) {
     case REQUEST_HISTORY:
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
     case RECEIVE_HISTORY:
       return {
         ...state,
         [crypto]: {
           ...state[crypto],
           [fiat]: {
             isFetching: false,
             didInvalidate: false,
             items: action.results,
             lastUpdated: action.receivedAt
           }
         }
       }
     default:
       return state
   }
 }

 export const fetchHistory = (crypto, fiat) => dispatch => {
   dispatch(requestHistory(crypto, fiat))
   return fetch(`${API_ROOT}/${crypto}?fiat=${fiat}`)
     .then(response => response.json())
     .then(json => dispatch(receiveHistory(crypto, fiat, json)))
 }

 export const receiveHistory = (crypto, fiat, results) => ({
   type: RECEIVE_HISTORY,
   crypto,
   fiat,
   results,
   receivedAt: Date.now()
 })

 export const requestHistory = (crypto, fiat) => ({
   type: REQUEST_HISTORY,
   crypto, fiat
 })
