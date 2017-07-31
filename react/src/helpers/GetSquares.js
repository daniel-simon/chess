let gameConstants = require('./GameConstants.js')
let pieceMoves = require('./PieceMoves.js')
let squareMethods = require('./SquareMethods.js')

let getSquares = {

  availableToPiece (col, row, boardState) {
    let occupant = boardState[col][row]
    let possibleSquares = pieceMoves[occupant.type](occupant.color, col, row, boardState)
    let availableSquares = this.filterSquaresOccupiedByAllies(occupant.color, possibleSquares, boardState)

    return availableSquares
  },

  attackedByPiece (col, row, boardState) {
    let occupant = boardState[col][row]
    let attackedSquares = []
    if (occupant.type === 'pawn') {
      attackedSquares = pieceMoves.pawnDiagonals(occupant.color, col, row, boardState)
    } else {
      attackedSquares = pieceMoves[occupant.type](occupant.color, col, row, boardState)
    }

    return attackedSquares
  },

  unsafeForMe (color, boardState) {
    let enemyColor = gameConstants.enemyOf(color)
    let enemyPieceCoords = this.getPieceCoordsOfSameColor(enemyColor, boardState)

    let unsafeSquares = []
    enemyPieceCoords.forEach(enemySquare => {
      let [col, row] = enemySquare
      let occupant = boardState[col][row]
      let squaresThreatenedByThisPiece = this.attackedByPiece(...enemySquare, boardState)
      squaresThreatenedByThisPiece.forEach(square => {
        unsafeSquares.push(square)
      })
    })
    unsafeSquares = squareMethods.toUnique(unsafeSquares)
    return unsafeSquares
  },

  getPieceCoordsOfSameColor (color, boardState) {
    let pieceCoordsOfSameColor = []
    for (let [col, row] of gameConstants.allBoardSquares()) {
      let occupant = boardState[col][row]
      if (occupant && occupant.color === color) {
        pieceCoordsOfSameColor.push([col, row])
      }
    }
    return pieceCoordsOfSameColor
  },

  filterSquaresOccupiedByAllies (color, possibleSquares, boardState) {
    let occupant, occupiedByAlly
    let availableSquares = possibleSquares.filter(square => {
      let [col, row] = square
      occupant = boardState[col][row]
      occupiedByAlly = occupant ? (occupant.color === color) : false

      return !occupiedByAlly
    })
    return availableSquares
  }
}


module.exports = getSquares
