import {createStore, applyMiddleware, combineReducers} from 'redux'

import {createLogger} from 'redux-logger'

import ui  from './ui'

const configureStore = preloadedState => createStore(
  ui,
  preloadedState,
  applyMiddleware(createLogger())
)

export default configureStore
