/**
 * Keeping state of the UI here
 *
 */

const TOGGLE_LEFT = 'TOGGLE_LEFT'
const RESIZE_CHART = 'RESIZE_CHART'

export default (state = {
  left: 0,
  chartHeight: 300,
  chartWidth: 450
}, action) => {
  switch (action.type) {
    case RESIZE_CHART:
      return {
        ...state,
        chartHeight: window.innerHeight - 170,
        chartWidth: window.innerWidth
      }
    case TOGGLE_LEFT:
      return {
        ...state,
        left: state.left > 0 ? 0 : 300
      }
    default:
      return state
  }
}

export const toggleLeft = () => ({
  type: TOGGLE_LEFT
})

export const resizeChart = () => ({
  type: RESIZE_CHART
})
