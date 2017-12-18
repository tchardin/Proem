/*
 * State of the user portfolio
 *
 */

 import moment from 'moment'
 import omit from 'lodash/omit'

 import {updateGroup, updateDate, deleteFromGroup} from './routing'
 import {updateSelected, toggleEdit} from './ui'
 import {resetForm} from './form'

const DELETE_TX = 'DELETE_TX'
const DELETE_ASSET = 'DELETE_ASSET'
const UPDATE_PORTFOLIO = 'UPDATE_PORTFOLIO'
const ERROR_PORTFOLIO = 'ERROR_PORTFOLIO'

const initialState = {
  allIds: [],
  assets: {}
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
    case DELETE_TX:
      return {
        ...state,
        assets: {
          ...state.assets,
          [action.id]: {
            balance: state.assets[action.id].balance - Number(action.value.amount),
            transactions: removeItem(state.assets[action.id].transactions, action.index)
          }
        }
      }
    case DELETE_ASSET:
      return {
        ...state,
        allIds: removeItem(state.allIds, state.allIds.indexOf(action.id)),
        assets: omit(state.assets, [`${action.id}`])
      }
    default:
      return state
    }
  }

  const removeItem = (array, index) => {
    let newArray = array.slice()
    newArray.splice(index, 1)
    return newArray
  }

 const transaction = (state, action) => {
   const {date, amount} = action
   if (typeof state === 'undefined') {
     return [{date, amount}]
   }
   return state.transactions.concat({date, amount})
 }

 const deleteTransaction = (id, value, index) => ({
   type: DELETE_TX,
   id, value, index
 })

 const deleteAsset = id => ({
   type: DELETE_ASSET,
   id
 })

 export const editPortfolio = (value, id, index) => (dispatch, getState) => {
   let txs = getState().portfolio.assets[id].transactions
   dispatch(toggleEdit())
   if (txs.length === 1) {
     dispatch(updateSelected('selectedTxs', null))
     dispatch(deleteFromGroup(id))
     dispatch(deleteAsset(id))
   } else {
     dispatch(deleteTransaction(id, value, index))
   }
 }

 const updatePortfolio = (currency, amount, date, newBalance) => ({
   type: UPDATE_PORTFOLIO,
   currency, amount, date, newBalance
 })

 const errorPortfolio = currency => ({
   type: ERROR_PORTFOLIO,
   currency
 })

 // const earliestDate = (state, id) => {
 //   let eD = new Date()
 //   state.assets[id].transactions.forEach(t => {
 //     t.date < eD ? t.date : eD
 //   })
 //   return eD
 // }

 export const newTransaction = (currency, amount, date) => (dispatch, getState) => {
   const {assets} = getState().portfolio
   const currentBalance = assets[currency] ? assets[currency].balance : 0
   const newBalance = currentBalance + Number(amount)
   if (newBalance < 0 || !moment(date).isValid() || !amount > 0 ) {
     dispatch(errorPortfolio(currency))
   } else {
     dispatch(resetForm('portfolio'))
     dispatch(updatePortfolio(currency, amount, date, newBalance))
     dispatch(updateGroup(currency))
     let currentDate = getState().routing.variables.date
     let newDate = moment(date)
     if (newDate.isBefore(currentDate)) {
       dispatch(updateDate(newDate.format('YYYY-MM-DD')))
     }
   }
 }
