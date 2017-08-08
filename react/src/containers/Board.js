import React, { Component } from 'react'
import BoardInterface from './BoardInterface'
import TestBoard from '../helpers/TestBoard'
let gameConstants = require('../helpers/GameConstants')

class Board extends Component {
  constructor (props) {
    super(props)
    this.state = this.emptyBoard()
    this.movePiece = this.movePiece.bind(this)
    this.recordMove = this.recordMove.bind(this)
  }

  emptyBoard () {
    let blankBoard = {
      board: [
        [],[],[],[],[],[],[],[]
      ],
      lastMove: {},
      moveHistory: []
    }
    for (let col = 0; col <= 7; col++) {
      for (let row = 0; row <= 7; row++) {
        blankBoard.board[col][row] = null
      }
    }
    return blankBoard
  }

  componentDidMount () {
    const setupType = 'real'  //real or 960
    const pawns = true
    this.setUpPieces(setupType, pawns)
    this.loadBoardState(this.props.initialMoveHistory)
  }

  loadBoardState (moveHistory) {
    let testBoard = new TestBoard('newGame')
    moveHistory.forEach(move => {
      testBoard.movePiece(move.origin, move.destination)
    })
    let newBoardState = testBoard.state
    this.setState({ moveHistory: moveHistory, board: newBoardState })
  }

  setUpPieces (setupType, pawns) {
    let newBoard = this.state.board
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
        let kingFrom1 = king + 1
        leftRook = Math.floor(king * Math.random())
        rightRook = kingFrom1 + Math.floor((8 - kingFrom1) * Math.random())
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
    this.setState({
      board: newBoard
    })
  }

  recordMove (move) {
    let lastMove = {}
    move.moveNumber = this.state.moveHistory.length

    for (let property in move) {
      lastMove[property] = move[property]
    }
    let [fromCol, fromRow] = move.origin
    let [toCol, toRow] = move.destination
    lastMove.movedPiece = this.state.board[fromCol][fromRow]

    if (!move.castle) {
      lastMove.capturedPiece = this.state.board[toCol][toRow]
      lastMove.castleSide = null
    } else {
      lastMove.capturedPiece = null
      lastMove.castleSide = toCol > 4 ? 'kingside' : 'queenside'
    }
    //move this logic down to the board interface

    //if (move.enPassant) { etc... }

    let moveHistory = this.state.moveHistory
    let newMoveHistory = moveHistory.concat( [lastMove] )

    this.updateBackend(lastMove)
    this.setState({ lastMove: lastMove, moveHistory: newMoveHistory })
  }

  updateBackend (move) {
    this.persistMove(move)
    this.props.toggleActivePlayer()
  }

  persistMove (move) {
    move.gameId = this.props.gameId
    let moveRequest = { move: move }
    fetch('/api/v1/moves', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(moveRequest)
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        let errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
    })
    .catch(error => console.error(`Error posting move to database: ${error.message}`))
  }

  movePiece (origin, destination) {
    let [fromCol, fromRow] = origin
    let [toCol, toRow] = destination
    let movedPiece = this.state.board[fromCol][fromRow]

    if (
      movedPiece.type === 'pawn' &&
      toRow === gameConstants.lastRowFor(movedPiece.color)
    ) {
        movedPiece.type = 'queen'
    }

    let newBoardState = this.state.board
    newBoardState[toCol][toRow] = movedPiece
    newBoardState[fromCol][fromRow] = null

    this.setState({ board: newBoardState })
  }

  render () {
    return(
      <BoardInterface
        movePiece={this.movePiece}
        recordMove={this.recordMove}
        boardState={this.state.board}
        moveHistory={this.state.moveHistory}
        lastMove={this.state.lastMove}
        myColor={this.props.myColor}
        isMyTurn={this.props.isMyTurn}
        pieceSet={this.props.pieceSet}
      />
    )
  }
}

export default Board
