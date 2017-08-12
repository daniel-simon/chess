let gameConstants = require('../../src/helpers/GameConstants.js')

class TestBoard {
  constructor (firstMethodName, firstMethodArg) {
    this.state = [
      [],[],[],[],[],[],[],[]
    ]
    this.moveHistory = []
    this.clearAll()
    if (firstMethodName) {
      this[firstMethodName](firstMethodArg)
    }
  }

  clearAll () {
    for (let col = 0; col <= 7; col++) {
      for (let row = 0; row <= 7; row++) {
        this.state[col][row] = null
      }
    }
  }

  clearSquare (col, row) {
    this.state[col][row] = null
  }

  setTestState (boardState) {
    boardState.map((colArray, col) => {
      colArray.map((occupant, row) => {
        this.state[col][row] = occupant
      })
    })
  }

  addPiece (color, col, row, type) {
    this.state[col][row] = {
      type: type,
      color: color
    }
  }

  newGame () {
    this.addNonPawns()
    this.addPawns('white')
    this.addPawns('black')
  }

  addKingAndRooks (color) {
    let colors = []
    if (color == undefined) {
      colors = ['white', 'black']
    } else {
      colors = [color]
    }
    colors.forEach(color => {
      let row = gameConstants.firstRowFor(color)
      this.addPiece(color, 4, row, 'king')
      this.addPiece(color, 0, row, 'rook')
      this.addPiece(color, 7, row, 'rook')
    })
  }

  addNonPawns (color) {
    let colors = []
    if (color == undefined) {
      colors = ['white', 'black']
      this.addKingAndRooks()
    } else {
      colors = [color]
      this.addKingAndRooks(color)
    }
    colors.forEach(color => {
      let row = gameConstants.firstRowFor(color)
      this.addPiece(color, 1, row, 'knight')
      this.addPiece(color, 6, row, 'knight')
      this.addPiece(color, 2, row, 'bishop')
      this.addPiece(color, 5, row, 'bishop')
      this.addPiece(color, 3, row, 'queen')
    })
  }

  addPawns (color) {
    let row = gameConstants.secondRowFor(color)
    for (let col = 0; col <= 7; col++) {
      this.addPiece(color, col, row, 'pawn')
    }
  }

  movePiece (origin, destination, loadingRealMove = false) {
    let [fromCol, fromRow] = origin
    let [toCol, toRow] = destination
    let movedPiece = this.state[fromCol][fromRow]
    if (movedPiece == null) {
      throw new Error(`TestBoard error: no piece at square ${fromCol}, ${fromRow}`)
    } else if (movedPiece.color == null) {
      throw new Error(`TestBoard error: piece at square ${fromCol}, ${fromRow} has undefined color`)
    }
    let player = movedPiece.color
    let move = {
      origin: origin,
      destination: destination,
      player: player,
      castle: false
    }

    if (
      loadingRealMove &&
      movedPiece.type === 'pawn' &&
      toRow === gameConstants.lastRowFor(movedPiece.color)
    ) {
        let promotedPawn = new Object
        promotedPawn.color = movedPiece.color
        promotedPawn.type = 'queen'
        this.state[toCol][toRow] = promotedPawn
    } else {
        this.state[toCol][toRow] = movedPiece
    }
    this.state[fromCol][fromRow] = null
    this.recordMove(move)
  }

  recordMove (move) {
    let lastMove = {}
    for (let property in move) {
      lastMove[property] = move[property]
    }
    let [fromCol, fromRow] = move.origin
    let [toCol, toRow] = move.destination
    lastMove.movedPiece = this.state[fromCol][fromRow]

    if (move.castle) {
      lastMove.capturedPiece = null
      lastMove.castleSide = toCol > 4 ? 'kingside' : 'queenside'
    }
    this.moveHistory.push(lastMove)
  }
}

export default TestBoard
