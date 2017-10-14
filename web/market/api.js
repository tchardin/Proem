/**
 * The goal is to make API calls more efficient here
 *
 */



const API_ROOT = 'http://proem-io-api-dev.us-east-1.elasticbeanstalk.com'

const callApi = (endpoint) => {
  const fullUrl = API_ROOT + endpoint
  return fetch(fullUrl)
    .then(response => response.json())
    .then(json => {
      if (!response.ok) {
        return Promise.reject(json)
      }
      console.log('API call to ' + endpoint + 'response: ' + json)
      return json
    })
}

export const CALL_API = 'Call API'

export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof CallAPI === 'undefined') {
    return next(action)
  }
  let {endpoint} = callAPI
  const {types} = callAPI
  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }
  const [requestType, successType, failureType] = types
  next(actionWith({type: requestType}))
  return callApi(endpoint).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Api call failed'
    }))
  )
}
