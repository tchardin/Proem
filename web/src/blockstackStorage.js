// const blockstack = require('blockstack')
const STORAGE_FILE = 'portfolio'

export const loadPortfolio = () => {
  try {
    // const decrypt = true
    // blockstack.getFile(STORAGE_FILE, decrypt)
    // .then(pfData => {
    //   if (pfData === null) {
    //     return undefined
    //   }
    //   return JSON.parse(pfData)
    // })

    const serializedState = localStorage.getItem(STORAGE_FILE)
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)

  } catch (err) {
    return undefined
  }
}

export const savePortfolio = state => {
  try {
    const serializedState = JSON.stringify(state)
    // const encrypt = true
    // blockstack.putFile(STORAGE_FILE, serializedState, encrypt)
    localStorage.setItem(STORAGE_FILE, serializedState)
  } catch (err) {
    // Log errors
  }
}
