/**
 * Blockstack authentication
 *
 */

const blockstack = require('blockstack')

const REQUEST_LOGIN = 'LOGIN_REQUEST'
const FAILURE_LOGIN = 'LOGIN_FAILURE'
const RECEIVE_USER = 'RECEIVE_USER'
const RESET_USER = 'RESET_USER'

export default (state = {}, action) => {
  switch (action.type) {
    case REQUEST_LOGIN:
      return {
        isLoading: true
      }
    case RECEIVE_USER:
      return {
        isLoading: false,
        info: action.user
      }
    case FAILURE_LOGIN:
      return {
        isLoading: false,
        error: true
      }
    case RESET_USER:
      return null
    default:
      return state
  }
}

export const requestLogin = () => ({
  type: REQUEST_LOGIN
})

export const receiveUser = user => ({
  type: RECEIVE_USER,
  user
})

export const resetUser = () => ({
  type: RESET_USER
})

export const loadUser = () => dispatch => {
  if (blockstack.isUserSignedIn()) {
      let newUser = blockstack.loadUserData()
      dispatch(receiveUser(newUser))
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn()
      .then((userData) => {
        window.location = window.location.origin
      })
  }
}

export const signUserIn = () => dispatch => {
  dispatch(requestLogin())
  blockstack.redirectToSignIn(`${window.location.origin}/login`)
}

export const signUserOut = () => dispatch => {
  dispatch(resetUser())
  blockstack.signUserOut(window.location.origin)
}
