/**
 * Plugging a Reddux provider to the root component
 *
 */

/* @flow */

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import configureStore from './store/configureStore'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import {loadPortfolio, savePortfolio} from './blockstackStorage'
import throttle from 'lodash/throttle'

const storedPortfolio = loadPortfolio()
const store = configureStore(storedPortfolio)

store.subscribe(throttle(() => {
  savePortfolio({
    portfolio: store.getState().portfolio
  })
}, 1000))

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'))
registerServiceWorker()
