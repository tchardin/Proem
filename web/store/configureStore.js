import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import ids from '../market/ids'
import history from '../market/history'
import metrics from '../market/metrics'
import user from '../market/auth'
import form from '../market/import'
import alerts from '../market/alerts'
import portfolio from '../market/portfolio'


const rootReducer = combineReducers({
  ids, history, metrics, user, form, alerts, portfolio
})

const configureStore = preloadedState => createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(thunk, createLogger())
)

export default configureStore
