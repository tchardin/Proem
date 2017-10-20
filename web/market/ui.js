/**
 * Keeping state of the UI here
 *
 */

const CHANGE_VIEW = 'CHANGE_VIEW'

export default (state = 'HISTORY', action) => {
  switch (action.type) {
    case 'CHANGE_VIEW':
      return action.view
    default:
      return state
  }
}

export const changeView = view => ({
  type: CHANGE_VIEW,
  view
})
