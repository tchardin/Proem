/**
 * Gonna sync the state with routes
 * @flow
 */

import router from '../router'
import history from '../history'
import isEqual from 'lodash/isEqual'
import moment from 'moment'
import {updateUI} from './ui'

type Render = (Array<React.Element<*>>, ?Object, ?Object) => any;

type State = {
  location: Location,
  params: Object,
  query: ?Object,
  variables: Object,
  components: ?Array<React.Element<*>> | Promise<Array<React.Element<*>>>,
  render: ?Render,
};

const UPDATE_GROUP = 'UPDATE_GROUP'
const UPDATE_SELECTED = 'UPDATE_SELECTED'
const UPDATE_DATE = 'UPDATE_DATE'
const SWITCH_ROUTE = 'SWITCH_ROUTE'

const initialState = {
  location: history.location,
  params: {},
  query: null,
  variables: {
    coin: 'BTC',
    fiat: 'USD',
    group: [],
    date: moment().format('YYYY-MM-DD')
  },
  components: null,
  render: null
}

export default (state: State = initialState, action): State => {
    switch (action.type) {
      case SWITCH_ROUTE:
        return {
          ...action.route,
          location: action.location,
          variables: {...state.variables, ...action.variables}
        }
      case UPDATE_GROUP:
        return {
          ...state,
          variables: {
            ...state.variables,
            group: state.variables.group.includes(action.value) ?
              [...state.variables.group] : state.variables.group.concat(action.value)
          }
        }
      case UPDATE_DATE:
        return {
          ...state,
          variables: {
            ...state.variables,
            date: action.date
          }
        }
      default:
        return state
    }
}

const updateObject = (action, state) => ({
  ...state,
  [action.id]: action.value
})

const updateSelected = (id, value) => ({
  type: UPDATE_SELECTED,
  id, value
})

const switchRoute = (route, location, variables) => ({
  type: SWITCH_ROUTE,
  route, location, variables
})

export const updateGroup = value => ({
  type: UPDATE_GROUP,
  value
})

export const updateDate = date => ({
  type: UPDATE_DATE,
  date
})

export const resolveRoute = location => (dispatch, getState) =>
  router.resolve({ path: location.pathname}).then(route => {
    // const prevVariables = getState().routing.variables
    // const variables = isEqual(prevVariables, route.variables)
    //   ? prevVariables
    //   : route.variables;
    dispatch(switchRoute(route, location, route.variables))
  })
