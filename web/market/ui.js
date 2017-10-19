/**
 * Keeping state of the UI here
 *
 */

const SHOW_CARD = 'SHOW_CARD'
const HIDE_CARD = 'HIDE_CARD'

const initialState = {
  cardType: 'METRICS',
  cardProps: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_CARD':
      return {
        cardType: action.cardType,
        cardProps: action.cardProps
      }
    case 'HIDE_CARD':
      return initialState
    default:
      return state
  }
}

export const showCard = (cardType, cardProps) => ({
  type: SHOW_CARD,
  cardType,
  cardProps
})

export const hideCard = () => ({
  type: HIDE_CARD
})
