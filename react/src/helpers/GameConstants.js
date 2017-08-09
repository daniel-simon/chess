let gameConstants = {

  firstRowFor (color) {
    let home = (color === 'white') ? 0 : 7
    return home
  },

  secondRowFor (color) {
    let pawnHome = (color === 'white') ? 1 : 6
    return pawnHome
  },

  fifthRowFor (color) {
    let fifth = (color === 'white') ? 4 : 3
    return fifth
  },

  lastRowFor (color) {
    let last = (color === 'white') ? 7 : 0
    return last
  },

  forwardStepFor (color) {
    let step = (color === 'white') ? 1 : -1
    return step
  },

  enemyOf (color) {
    let enemy = (color === 'white') ? 'black' : 'white'
    return enemy
  },

  castleDestinationFor (pieceType, rookCol) {
    let castleDest = {}
    switch (rookCol) {
    case 'kingside':
      castleDest = {
        king: 6,
        rook: 5
      }
      break
    case 'queenside':
      castleDest = {
        king: 2,
        rook: 3
      }
      break
    }
    return castleDest[pieceType]
  },

  colName (col) {
    return "abcdefgh".charAt(col)
  },

  rowName (row) {
    return `${row + 1}`
  },

  squareName (col, row) {
    return (this.colName(col) + this.rowName(row))
  },

  pieceName (piece) {
    let name
    switch (piece.type) {
      case 'king':
        name = 'K'
        break
      case 'queen':
        name = 'Q'
        break
      case 'rook':
        name = 'R'
        break
      case 'bishop':
        name = 'B'
        break
      case 'knight':
        name = 'N'
        break
      case 'pawn':
        name = ''
        break
    }
    return name
  },

  allBoardSquares () {
    let boardSquares = []
    for (let col = 0; col <= 7; col++) {
      for (let row = 0; row <= 7; row++) {
        boardSquares.push( [col, row] )
      }
    }
    return boardSquares
  }
}

module.exports = gameConstants
