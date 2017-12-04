import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'

import ui  from './ui'
import routing from './routing'
import user from './user'
import form from './form'
import portfolio from './portfolio'

const rootReducer = combineReducers({
  ui, routing, user, form, portfolio
})

const configureStore = preloadedState => createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(thunk, createLogger())
)

export default configureStore
