import React, { Component } from 'react'
import BoardInterface from './BoardInterface'
import TestBoard from '../helpers/TestBoard'
let gameConstants = require('../helpers/GameConstants')
let boardSetter = require('../helpers/BoardSetter')

class Board extends Component {
  constructor (props) {
    super(props)
    this.state = {
      presentBoard: [
        [],[],[],[],[],[],[],[]
      ],
      displayedBoard: [
        [],[],[],[],[],[],[],[]
      ],
      moveHistory: [],
      boardStateHistory: [],
      displayedStateIndex: null,
      isMyTurn: this.props.initiallyMyTurn
    }
    this.stepThroughStateHistory = this.stepThroughStateHistory.bind(this)
    this.jumpToHistoryEndpoint = this.jumpToHistoryEndpoint.bind(this)
    this.changeDisplayedState = this.changeDisplayedState.bind(this)
    this.recordMove = this.recordMove.bind(this)
    this.movePiece = this.movePiece.bind(this)
  }

  componentDidMount () {
    let gameId = this.props.gameId
    this.refreshMoveHistory(gameId, true, )
    this.subscribeToGameChannel(gameId, this.props.myColor, this.refreshMoveHistory)
  }

  refreshMoveHistory (gameId, forceDisplayUpdate) {
    let loadBoardStateAndHistory = (moveHistory, forceDisplayUpdate) => { this.loadBoardStateAndHistory(moveHistory, forceDisplayUpdate) }
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
      // debugger
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
    let presentBoard = snapShotBoardState(testBoard.state)
    boardStateHistory.push(presentBoard)

    // let newDisplayedBoard, newDisplayedStateIndex
    // if (forceDisplayUpdate) {
    //   newDisplayedBoard = presentBoard,
    //   newDisplayedStateIndex = boardStateHistory.length - 1
    // } else {
    //   newDisplayedBoard = this.state.displayedBoard
    //   newDisplayedStateIndex = this.state.displayedStateIndex
    // }

    this.setState({
      presentBoard: presentBoard,
      displayedBoard: presentBoard,
      boardStateHistory: boardStateHistory,
      displayedStateIndex: boardStateHistory.length - 1,
      moveHistory: moveHistory,
    })
  }

  subscribeToGameChannel (gameId, myColor) {
    let refreshMoveHistory = () => { this.refreshMoveHistory(gameId, true) }
    let localToggleTurn = () => { this.setState({ isMyTurn: !this.state.isMyTurn }) }
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
            localToggleTurn()
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

    let movedPiece = this.state.presentBoard[fromCol][fromRow]
    if (
      movedPiece.type === 'pawn' &&
      toRow === gameConstants.lastRowFor(movedPiece.color)
    ) {
        movedPiece.type = 'queen'
    }

    let newBoardState = this.state.presentBoard
    newBoardState[toCol][toRow] = movedPiece
    newBoardState[fromCol][fromRow] = null

    let newStateHistory = this.state.boardStateHistory.concat( [newBoardState] )
    this.setState({
      presentBoard: newBoardState,
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
    // debugger
    let newDisplayedState = this.state.boardStateHistory[index]
    this.setState({
      displayedBoard: newDisplayedState,
      displayedStateIndex: index,
    })
  }

  render () {
    let upToDate = (this.state.displayedStateIndex === this.state.boardStateHistory.length - 1)
    let stepBackward = () => { this.stepThroughStateHistory(-1) }
    let stepForward = () => { this.stepThroughStateHistory(1) }
    let jumpToStart = () => { this.jumpToHistoryEndpoint('backward') }
    let jumpToNow = () => { this.jumpToHistoryEndpoint('forward') }
    let backwardIcon = '<'
    let forwardIcon = '>'
    let startIcon = '<<'
    let endIcon = '>>'
    let rewindCss = ''
    let forwardCss = ''
    if (this.state.displayedStateIndex === this.state.boardStateHistory.length - 1) {
      forwardCss = 'maxed'
    } else {
      forwardCss = 'catch-up'
    }
    if (this.state.displayedStateIndex === 0) {
      rewindCss = 'maxed'
    }
    let headerText
    if (this.state.isMyTurn) {
      headerText = `Your turn (${this.props.myColor})`
    } else {
      headerText = `${this.props.playerData.opponent.username}'s turn (${this.props.playerData.opponent.color})`
    }
    return(
      <div>
        <div className="small-12 small-centered text-center columns">
          <h2>{headerText}</h2>
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
          />
          <div className="row">
            <div className="small-6 text-center playback-buttons-container small-centered columns">
              <span className={`playback outer button panel ${rewindCss}`} onClick={jumpToStart}>
                {startIcon}
              </span>
              <span className={`playback inner button panel ${rewindCss}`} onClick={stepBackward}>
                {backwardIcon}
              </span>
              <span className={`playback inner button panel ${forwardCss}`} onClick={stepForward}>
                {forwardIcon}
              </span>
              <span className={`playback outer button panel ${forwardCss}`} onClick={jumpToNow}>
                {endIcon}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Board
