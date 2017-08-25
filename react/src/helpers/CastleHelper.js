let gameConstants = require('./GameConstants.js')
let getSquares = require('./GetSquares.js')
let squareMethods = require('./SquareMethods.js')

let castleHelper = {

  kingHasNotMoved (moveHistory, player) {
    let kingHasNotMoved = true
    moveHistory.forEach(move => {
      if (move.player_color === player && move.moved_piece === 'king') {
        kingHasNotMoved = false
      }
    })
    return kingHasNotMoved
  },

  rookHasNotMoved (moveHistory, player, col) {
    let rookHasNotMoved = true
    moveHistory.forEach(move => {
      let fromCol = move.origin[0]
      if (move.player_color === player) {
        if (
          move.moved_piece === 'rook' &&
          fromCol === col
        ) {
            rookHasNotMoved = false
        } else if (
          move.castlingRook &&
          move.castlingRookOrigin[0] === col
        ) {
            rookHasNotMoved = false
        }
      }
    })
    return rookHasNotMoved
  },

  rookIsHome (player, col, boardState) {
    let homeRow = gameConstants.firstRowFor(player)
    let occupant = boardState[col][homeRow]
    return (
      occupant
      && occupant.type === 'rook'
      && occupant.color === player
    )
  },

  getCastlePath (player, startCol, endCol) {
    let row = gameConstants.firstRowFor(player)
    let pathSquares = []
    let colStep = Math.sign(endCol - startCol)
    for (let col = startCol; col !== endCol + colStep; col += colStep) {
      pathSquares.push( [col, row] )
    }
    return pathSquares
  },

  castlePathIsClear (player, startCol, endCol, boardState) {
    let pathSquares = this.getCastlePath(player, startCol, endCol)
    let clear = true
    pathSquares.forEach(pathSquare => {
      let [col, row] = pathSquare
      if (boardState[col][row] != null) {
        clear = false
      }
    })
    return clear
  },

  castlePathIsSafe (player, startCol, endCol, boardState) {
    let pathSquares = this.getCastlePath(player, startCol, endCol)
    let unsafeSquares = getSquares.unsafeForMe(player, boardState)
    let safe = true
    pathSquares.forEach(pathSquare => {
      if (squareMethods.includesSquare(unsafeSquares, pathSquare)) {
        safe = false
      }
    })
    return safe
  },

  getAvailableCastlingRooks (moveHistory, player, boardState) {
    let rookSquares = []
    if (this.kingHasNotMoved(moveHistory, player)) {
      let homeRow = gameConstants.firstRowFor(player)
      if (
        this.rookIsHome(player, 0, boardState) &&
        this.rookHasNotMoved(moveHistory, player, 0) &&
        this.castlePathIsClear(player, 1, 3, boardState) &&
        this.castlePathIsSafe(player, 2, 4, boardState)
      ) {
          rookSquares.push( [0, homeRow] )
      }
      if (
        this.rookIsHome(player, 7, boardState) &&
        this.rookHasNotMoved(moveHistory, player, 7) &&
        this.castlePathIsClear(player, 5, 6, boardState) &&
        this.castlePathIsSafe(player, 4, 6, boardState)
      ) {
          rookSquares.push( [7, homeRow] )
      }
    }
    return rookSquares
  }
}

module.exports = castleHelper
