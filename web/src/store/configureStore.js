import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import ids from './ids'
import history from './history'
import metrics from './metrics'
import user from './user'
import form from './form'
import alerts from './alerts'
import portfolio from './portfolio'
import candles from './candles'
import ui from './ui'


const rootReducer = combineReducers({
  ids, history, metrics, user, form, alerts, portfolio, candles, ui
})

const configureStore = preloadedState => createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(thunk, createLogger())
)

export default configureStore
