import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import reducers from '../market/reducers'
import {createLogger} from 'redux-logger'


const configureStore = preloadedState => createStore(
  reducers,
  preloadedState,
  applyMiddleware(thunk, createLogger())
)

export default configureStore
