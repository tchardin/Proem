/**
 * Keeping state of the UI here
 *
 */

const TOGGLE_LEFT = 'TOGGLE_LEFT'
const RESIZE_CHART = 'RESIZE_CHART'
const TOGGLE_CHART = 'TOGGLE_CHART'
const UPDATE_SELECTED = 'UPDATE_SELECTED'
const UPDATE_GROUP = 'UPDATE_GROUP'

export default (state = {
  left: 0,
  chartHeight: 300,
  chartWidth: 450,
  chartView: 'HISTORY',
  selectedCoin: 'BTC',
  selectedFiat: 'USD',
  selectedGroup: [],
  selectedTxs: null,
  ema: false,
  sma: false,
  bol: false,
  vol: false,
}, action) => {
  switch (action.type) {
    case RESIZE_CHART:
      return {
        ...state,
        chartHeight: window.innerHeight - 110,
        chartWidth: window.innerWidth
      }
    case TOGGLE_LEFT:
      return {
        ...state,
        left: state.left > 0 ? 0 : 300
      }
    case UPDATE_SELECTED:
      return {
        ...state,
        [action.selectedItem]: action.value
      }
    case UPDATE_GROUP:
      return {
        ...state,
        selectedGroup:
          state.selectedGroup.includes(action.value) ?
          removeItem(state.selectedGroup, state.selectedGroup.indexOf(action.value)) :
          [...state.selectedGroup, action.value]
      }
    case TOGGLE_CHART:
      return {
        ...state,
        chartView: action.view
      }
    default:
      return state
  }
}

const removeItem = (array, index) => {
  let newArray = array.slice()
  newArray.splice(index, 1)
  return newArray
}

export const updateGroup = value => ({
  type: UPDATE_GROUP,
  value
})

export const toggleLeft = () => ({
  type: TOGGLE_LEFT
})

export const resizeChart = () => ({
  type: RESIZE_CHART
})

export const toggleChart = view => ({
  type: TOGGLE_CHART,
  view
})

export const updateSelected = (selectedItem, value) => ({
  type: UPDATE_SELECTED,
  selectedItem, value
})

// export const updateUI = ({coin, fiat}) => (dispatch, getState) => {
//   const {selectedCoin, selectedFiat} = getState().ui
//   if (coin != selectedCoin) {
//     dispatch(updateSelected('selectedCoin', coin))
//   }
//   if (fiat != selectedFiat) {
//     dispatch(updateSelected('selectedFiat', fiat))
//   }
// }
