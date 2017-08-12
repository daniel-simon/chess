import React, { Component } from 'react'
import BoardInterface from './BoardInterface'
import TestBoard from '../helpers/TestBoard'
import GameOverMessage from '../components/GameOverMessage'
import GamePlaybackButtonsContainer from './GamePlaybackButtonsContainer'
let gameConstants = require('../helpers/GameConstants')
let getLegalSquares = require('../helpers/GetLegalSquares')
let checkHelper = require('../helpers/CheckHelper')
let boardSetter = require('../helpers/BoardSetter')

class Board extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentBoard: [
        [],[],[],[],[],[],[],[]
      ],
      displayedBoard: [
        [],[],[],[],[],[],[],[]
      ],
      moveHistory: [],
      boardStateHistory: [],
      displayedStateIndex: null,
      isMyTurn: this.props.initiallyMyTurn,
      gameOutcome: null,
      showMessageBool: false,
    }
    this.stepThroughStateHistory = this.stepThroughStateHistory.bind(this)
    this.jumpToHistoryEndpoint = this.jumpToHistoryEndpoint.bind(this)
    this.changeDisplayedState = this.changeDisplayedState.bind(this)
    this.recordMove = this.recordMove.bind(this)
  }

  componentDidMount () {
    let gameId = this.props.gameId
    this.refreshMoveHistory(gameId, true)
    this.subscribeToGameChannel(gameId, this.props.myColor, this.refreshMoveHistory)
  }

  checkForGameOver (activePlayer, currentBoard) {
    let legalMoves = getLegalSquares.forPlayer(activePlayer, currentBoard)
    if (legalMoves.length === 0) {
      if (checkHelper.kingInCheck(activePlayer, currentBoard)) {
        this.setState({ gameOutcome: ['checkmate', activePlayer], showMessageBool: true })
      } else {
        this.setState({ gameOutcome: ['stalemate', activePlayer], showMessageBool: true })
      }
    }
  }

  refreshMoveHistory (gameId, forceDisplayUpdate) {
    let loadBoardStateAndHistory = (moveHistory, forceDisplayUpdate) => {
      this.loadBoardStateAndHistory(moveHistory, forceDisplayUpdate)
    }
    fetch(`/api/v1/games/${gameId}/moves`, {
      credentials: 'same-origin',
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        let errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
    })
    .then(response => {
      loadBoardStateAndHistory(response.moves, forceDisplayUpdate)
    })
    .catch(error => console.error(`Couldn't fetch move history: ${error.message}`))
  }

  loadBoardStateAndHistory (moveHistory, forceDisplayUpdate) {
    let snapShotBoardState = boardState => {
      let copiedState = [
        [],[],[],[],[],[],[],[]
      ]
      boardState.map((colArray, col) => {
        colArray.map((occupant, row) => {
          copiedState[col][row] = occupant
        })
      })
      return copiedState
    }

    let testBoard = new TestBoard('newGame')
    let boardStateHistory = []
    moveHistory.forEach(move => {
      boardStateHistory.push(snapShotBoardState(testBoard.state))
      if (!move.castle) {
        testBoard.movePiece(move.origin, move.destination)
      }
      if (move.castle) {
        let rookOriginCol = move.destination[0] > 4 ? 7 : 0
        let rookDestinationCol = move.destination[0] > 4 ? 5 : 3
        let homeRow = move.origin[1]
        let rookOrigin = [rookOriginCol, homeRow]
        let rookDestination = [rookDestinationCol, homeRow]
        testBoard.movePiece(move.origin, move.destination)
        testBoard.movePiece(rookOrigin, rookDestination)
      }
    })
    let currentBoard = snapShotBoardState(testBoard.state)
    boardStateHistory.push(currentBoard)
    // let newDisplayedBoard, newDisplayedStateIndex
    // if (forceDisplayUpdate) {
    //   newDisplayedBoard = currentBoard,
    //   newDisplayedStateIndex = boardStateHistory.length - 1
    // } else {
    //   newDisplayedBoard = this.state.displayedBoard
    //   newDisplayedStateIndex = this.state.displayedStateIndex
    // }
    let lastMove = moveHistory[moveHistory.length - 1]
    let myColor = this.props.myColor
    let myTurnNext = lastMove.player_color !== myColor
    let nextActiveColor = myTurnNext ? myColor : gameConstants.enemyOf(myColor)
    this.setState({
      currentBoard: currentBoard,
      displayedBoard: currentBoard,
      boardStateHistory: boardStateHistory,
      displayedStateIndex: boardStateHistory.length - 1,
      moveHistory: moveHistory,
      isMyTurn: myTurnNext,
    })
    this.checkForGameOver(nextActiveColor, currentBoard)
  }

  subscribeToGameChannel (gameId, myColor) {
    let refreshMoveHistory = () => { this.refreshMoveHistory(gameId, true) }

    if (App.cable.subscriptions.length > 0) {
      App.cable.subscriptions.remove(App.cable.subscriptions[0])
    }
    App.gameChannel = App.cable.subscriptions.create(
      {
        channel: "GameChannel",
        game_id: gameId
      },
      {
        connected: () => console.log("GameChannel connected"),
        disconnected: () => console.log("GameChannel disconnected"),
        received: (fetchCue) => {
          if (fetchCue.gameId === gameId) {
            refreshMoveHistory()
          }
        }
      }
    )
  }

  broadcastFetchCue () {
    App.gameChannel.send({
      gameId: this.props.gameId,
      playerColor: this.props.myColor,
    })
  }

  recordMove (move) {
    let moveHistory = this.state.moveHistory
    let newMoveHistory = moveHistory.concat( [move] )
    this.setState({ moveHistory: newMoveHistory })
    this.persistMove(move)
    this.props.toggleActivePlayer()
  }

  persistMove (move) {
    move.gameId = this.props.gameId
    let broadcastFetchCue = () => { this.broadcastFetchCue() }
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
    .then(response => {
      broadcastFetchCue()
    })
    .catch(error => console.error(`Error posting move to database: ${error.message}`))
  }

  movePiece (origin, destination) {
    let [fromCol, fromRow] = origin
    let [toCol, toRow] = destination

    let movedPiece = this.state.currentBoard[fromCol][fromRow]
    if (
      movedPiece.type === 'pawn' &&
      toRow === gameConstants.lastRowFor(movedPiece.color)
    ) {
        movedPiece.type = 'queen'
    }

    let newBoardState = this.state.currentBoard
    newBoardState[toCol][toRow] = movedPiece
    newBoardState[fromCol][fromRow] = null

    let newStateHistory = this.state.boardStateHistory.concat( [newBoardState] )
    this.setState({
      currentBoard: newBoardState,
      displayedBoard: newBoardState,
      boardStateHistory: newStateHistory,
      displayedStateIndex: newStateHistory.length - 1
    })
    // this.changeDisplayedState(newStateHistory.length - 1)
  }

  stepThroughStateHistory (step) {
    let newStateIndex = this.state.displayedStateIndex + step
    if (newStateIndex >= 0 && newStateIndex < this.state.boardStateHistory.length) {
      this.changeDisplayedState(newStateIndex)
    }
  }

  jumpToHistoryEndpoint (direction) {
    let index
    switch (direction) {
    case 'backward':
      index = 0
      break
    case 'forward':
      index = this.state.boardStateHistory.length - 1
      break
    }
    this.changeDisplayedState(index)
  }

  changeDisplayedState (index) {
    let newDisplayedState = this.state.boardStateHistory[index]
    this.setState({
      displayedBoard: newDisplayedState,
      displayedStateIndex: index,
    })
  }

  render () {
    let upToDate = (this.state.displayedStateIndex === this.state.boardStateHistory.length - 1)
    let headerText
    if (this.state.isMyTurn) {
      headerText = `Your turn (${this.props.myColor})`
    } else {
      headerText = `${this.props.playerData.opponent.username}'s turn (${this.props.playerData.opponent.color})`
    }
    let handleHideMessage = () => { this.setState({ showMessageBool: false }) }
    return(
      <div>
        <div className="small-12 small-centered text-center columns">
          <h2>{headerText}</h2>
          <div className="chess-board-container">
            <BoardInterface
              upToDate={upToDate}
              movePiece={this.movePiece}
              recordMove={this.recordMove}
              isMyTurn={this.state.isMyTurn}
              boardState={this.state.displayedBoard}
              moveHistory={this.state.moveHistory}
              myColor={this.props.myColor}
              showLegalMoves={this.props.showLegalMoves}
              pieceSet={this.props.pieceSet}
              gameOutcome={this.state.gameOutcome}
              showMessageBool={this.state.showMessageBool}
              handleHideMessage={handleHideMessage}
            />
          </div>
          <div className="row">
            <GamePlaybackButtonsContainer
              displayedStateIndex={this.state.displayedStateIndex}
              upToDate={upToDate}
              stepThroughStateHistory={this.stepThroughStateHistory}
              jumpToHistoryEndpoint={this.jumpToHistoryEndpoint}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Board
