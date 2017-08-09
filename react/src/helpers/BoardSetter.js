let gameConstants = require('./GameConstants')

let boardSetter = {

  getEmptyBoard () {
    let emptyBoard = [
      [],[],[],[],[],[],[],[]
    ]
    for (let col = 0; col <= 7; col++) {
      for (let row = 0; row <= 7; row++) {
        emptyBoard[col][row] = null
      }
    }
    return emptyBoard
  },

  initialSetup (setupType, pawns) {
    let newBoard = this.getEmptyBoard()
    if (setupType === 'real' || setupType === '960') {
      let king, queen, leftRook, rightRook, evenBishop, oddBishop
      let knights = []
      if (setupType === 'real') {
        leftRook = 0
        rightRook = 7
        knights = [1,6]
        evenBishop = 2
        oddBishop = 5
        queen = 3
        king = 4
      } else if (setupType === '960') {
        king = Math.floor(6 * Math.random()) + 1
        let kingOneBased = king + 1
        leftRook = Math.floor(king * Math.random())
        rightRook = kingOneBased + Math.floor((8 - kingOneBased) * Math.random())
        let filledCols = [king, leftRook, rightRook]
        do {
          evenBishop = 2 * Math.floor(4 * Math.random())
        } while (filledCols.includes(evenBishop))
        filledCols.push(evenBishop)
        do {
          oddBishop = 2 * Math.floor(4 * Math.random()) + 1
        } while (filledCols.includes(oddBishop))
        filledCols.push(oddBishop)
        do {
          queen = Math.floor(8 * Math.random())
        } while (filledCols.includes(queen))
        filledCols.push(queen)
        for (let i = 0; i <= 7; i++) {
          if (filledCols.indexOf(i) === -1) {
            knights.push(i)
            filledCols.push(i)
          }
        }
      }
      ['white','black'].forEach(color => {
        let home = gameConstants.firstRowFor(color)
        newBoard[leftRook][home] = newBoard[rightRook][home] = {
          type: 'rook',
          color: color
        }
        newBoard[knights[0]][home] = newBoard[knights[1]][home] = {
          type: 'knight',
          color: color
        }
        newBoard[evenBishop][home] = newBoard[oddBishop][home] = {
          type: 'bishop',
          color: color
        }
        newBoard[queen][home] = {
          type: 'queen',
          color: color
        }
        newBoard[king][home] = {
          type: 'king',
          color: color
        }
      })
    } else {
      //RNG test Pieces
      const types = ['knight', 'bishop', 'rook', 'queen', 'king']
      const colors = ['white', 'black']
      const pieceCount = 3
      const pawnCount = 3
      let col, row, color, type
      for (let n = 1; n <= pieceCount; n++) {
        col = Math.floor(8 * Math.random())
        row = Math.floor(8 * Math.random())
        while (newBoard[col][row] != null) {
          col = Math.floor(8 * Math.random())
          row = Math.floor(8 * Math.random())
        }
        type = types[Math.floor(5 * Math.random())]
        color = colors[Math.floor(2 * Math.random())]
        newBoard[col][row] = {
          type: type,
          color: color
        }
      }
      for (let n = 1; n <= pawnCount; n++) {
        col = Math.floor(8 * Math.random())
        row = Math.floor(8 * Math.random())
        while (newBoard[col][row] != null) {
          col = Math.floor(8 * Math.random())
          row = Math.floor(8 * Math.random())
        }
        color = colors[Math.floor(2 * Math.random())]
        newBoard[col][row] = {
          type: 'pawn',
          color: color
        }
      }
    }
    if (pawns) {
      for (let col = 0; col <= 7; col++) {
        ['white','black'].forEach(color => {
          let pawnHome = gameConstants.secondRowFor(color)
          newBoard[col][pawnHome] = {
            type: 'pawn',
            color: color
          }
        })
      }
    }
  }
}

module.exports = boardSetter
