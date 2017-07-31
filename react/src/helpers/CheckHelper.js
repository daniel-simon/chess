let getSquares = require('./GetSquares.js')
let squareMethods = require('./SquareMethods.js')
import TestBoard from './TestBoard'

let checkHelper = {

  kingInCheck (color, boardState) {
    let myPieceCoords = getSquares.getPieceCoordsOfSameColor(color, boardState)
    let myKingSquare
    for (let square of myPieceCoords) {
      let [col, row] = square
      let occupant = boardState[col][row]
      if (occupant.type === 'king' && occupant.color === color) {
        myKingSquare = square
        break
      }
    }
    let myUnsafeSquares = getSquares.unsafeForMe(color, boardState)
    let inCheck = squareMethods.includesSquare(myUnsafeSquares, myKingSquare)

    return inCheck
  },

  moveIsLegal (origin, destination, boardState) {
    let [fromCol, fromRow] = origin
    let testBoard = new TestBoard('setTestState', boardState)
    let color = boardState[fromCol][fromRow].color
    testBoard.movePiece(origin, destination)
    let isLegal = !this.kingInCheck(color, testBoard.state)
    testBoard.clearAll()

    return isLegal
  }
}

module.exports = checkHelper
