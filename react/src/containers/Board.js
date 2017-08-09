import React, { Component } from 'react'
import BoardInterface from './BoardInterface'
import TestBoard from '../helpers/TestBoard'
let gameConstants = require('../helpers/GameConstants')
let boardSetter = require('../helpers/BoardSetter')

class Board extends Component {
  constructor (props) {
    super(props)
    this.state = {
      board: [
        [],[],[],[],[],[],[],[]
      ],
      lastMove: {},
      moveHistory: []
    }
    this.movePiece = this.movePiece.bind(this)
    this.recordMove = this.recordMove.bind(this)
  }

  componentDidMount () {
    this.loadBoardState(this.props.initialMoveHistory)
  }

  loadBoardState (moveHistory) {
    let testBoard = new TestBoard('newGame')
    moveHistory.forEach(move => {
      if (!move.castle) {
        testBoard.movePiece(move.origin, move.destination)
      }
      if (move.castle) {
        testBoard.movePiece(move.origin, move.destination)
        //get kingside/queenside logic from testBoard
        //also relocate the move-model-building logic to <BoardInterface />
      }
    })
    let newBoardState = testBoard.state
    this.setState({ moveHistory: moveHistory, board: newBoardState })
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
        showLegalMoves={this.props.showLegalMoves}
        pieceSet={this.props.pieceSet}
      />
    )
  }
}

export default Board
