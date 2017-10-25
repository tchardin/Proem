/**
 * Keeping state of the UI here
 *
 */

const CHANGE_VIEW = 'CHANGE_VIEW'
const TOGGLE_CHART = 'TOGGLE_CHART'

export default (state = {
  portfolio: false,
  alerts: false,
  chart: 'LINE'
}, action) => {
  switch (action.type) {
    case CHANGE_VIEW:
      return {
        ...state,
        [action.view]: !state[action.view]
      }
    case TOGGLE_CHART:
      return {
        ...state,
        chart: action.view
      }
    default:
      return state
  }
}

export const changeView = view => ({
  type: CHANGE_VIEW,
  view
})

export const toggleChart = view => ({
  type: TOGGLE_CHART,
  view
})
