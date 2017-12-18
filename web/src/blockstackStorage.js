const blockstack = require('blockstack')
const STORAGE_FILE = 'portfolio'
const STORAGE_PATH = 'portfolio.json'

export const loadPortfolio = () => {
  if (blockstack.isUserSignedIn()) {
    try {
      const decrypt = true
      blockstack.getFile(STORAGE_PATH, decrypt)
      .then(pfData => {
        if (pfData === null) {
          return undefined
        }
        return JSON.parse(pfData)
      })
    } catch (err) {
      return undefined
    }
  } else {
    try {
      const serializedState = localStorage.getItem(STORAGE_FILE)
      if (serializedState === null) {
        return undefined
      }
      return JSON.parse(serializedState)

    } catch (err) {
      return undefined
    }
  }
}

export const savePortfolio = state => {
  if (blockstack.isUserSignedIn()) {
    try {
      const serializedState = JSON.stringify(state)
      const encrypt = true
      blockstack.putFile(STORAGE_PATH, serializedState, encrypt)
    } catch (err) {
      console.log('Blockstack storage failed ' + err)
    }
  } else {
    try {
      const serializedState = JSON.stringify(state)
      localStorage.setItem(STORAGE_FILE, serializedState)
    } catch (err) {
      // Log errors
    }
  }
}
