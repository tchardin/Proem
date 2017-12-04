/*
 * State of the user portfolio
 *
 */

 import moment from 'moment'

 import {updateGroup, updateDate} from './routing'

const UPDATE_PORTFOLIO = 'UPDATE_PORTFOLIO'
const ERROR_PORTFOLIO = 'ERROR_PORTFOLIO'

const initialState = {
  allIds: [],
  assets: {},
  charts: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PORTFOLIO:
      const {currency, newBalance} = action
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
    case ERROR_PORTFOLIO:
      return state
    default:
      return state
    }
  }

 const transaction = (state, action) => {
   const {date, amount} = action
   if (typeof state === 'undefined') {
     return [{date, amount}]
   }
   return state.transactions.concat({date, amount})
 }

 const updatePortfolio = (currency, amount, date, newBalance) => ({
   type: UPDATE_PORTFOLIO,
   currency, amount, date, newBalance
 })

 const errorPortfolio = currency => ({
   type: ERROR_PORTFOLIO,
   currency
 })

 const earliestDate = (state, id) => {
   let eD = new Date()
   state.assets[id].transactions.forEach(t => {
     t.date < eD ? t.date : eD
   })
   return eD
 }

 export const newTransaction = (currency, amount, date) => (dispatch, getState) => {
   const {assets} = getState().portfolio
   const currentBalance = assets[currency] ? assets[currency].balance : 0
   const newBalance = currentBalance + Number(amount)
   if (newBalance < 0) {
     dispatch(errorPortfolio(currency))
   } else {
     dispatch(updatePortfolio(currency, amount, date, newBalance))
     dispatch(updateGroup(currency))
     let currentDate = getState().routing.variables.date
     let newDate = moment(date)
     if (newDate.isBefore(currentDate)) {
       dispatch(updateDate(newDate.format('YYYY-MM-DD')))
     }
   }
 }
