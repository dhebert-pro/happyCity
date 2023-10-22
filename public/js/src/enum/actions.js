export default {
  REMOVE_CARD_FROM_LINE: (lineNumber, cardName) => ({ type: 'removeCardFromLine', lineNumber, cardName }), 
  ADD_CARD_TO_LINE: (lineNumber) => ({ type: 'addCardToLine', lineNumber }), 
  TAKE_CARD_FROM_LINE: (lineNumber, cardName) => ({ type: 'takeCardFromLine', lineNumber, cardName }), 
  TAKE_DWELLING_CARD: (cardName) => ({ type: 'takeDwellingCard', cardName }), 
  TAKE_SPECIAL_CARD: (cardName) => ({ type: 'takeSpecialCard', cardName }), 
  SKIP_TURN: () => ({ type: 'skipTurn' }),
  END_TURN: () => ({ type: 'endTurn' })
}