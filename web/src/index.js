import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import './index.css'

import configureStore from './store/configureStore'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

const store = configureStore()
const root = document.getElementById('root')
// const store = configureStore()

const renderComponent = component => {
  ReactDOM.render(<Provider store={store}>{component}</Provider>, root)
}

renderComponent(<App />)
registerServiceWorker()
