import React, { Component } from 'react'
import Board from './Board'
import BackButton from '../components/BackButton'

class GameShow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetchedMoves: false,
      initialMoveHistory: [],
      fetchedGameData: false,
      gameData: {},
      playerData: {},
      activePlayerData: {},
      myColor: '',
      initiallyMyTurn: null
    }
    this.toggleActivePlayer = this.toggleActivePlayer.bind(this)
  }

  componentDidMount () {
    let gameId = this.props.params.id
    this.fetchGameData(gameId)
    this.fetchMoveHistory(gameId)
  }

  fetchGameData (gameId) {
    fetch(`/api/v1/games/${gameId}`, {
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url
      } else if (response.ok) {
        return response.json()
      } else {
        let errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
    })
    .then(response => {
      let playerData = response.game_show_data.player_data
      let activePlayerData = playerData[playerData.initial_active_player_label]
      let myColor = playerData.user.color
      let isMyTurn = playerData.initial_active_player_label === 'user'
      this.setState({
        fetchedGameData: true,
        gameData: response.game_show_data,
        playerData: playerData,
        activePlayerData: activePlayerData,
        myColor: myColor,
        initiallyMyTurn: isMyTurn
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`))
  }

  fetchMoveHistory (gameId) {
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
      this.setState({
        fetchedMoves: true,
        initialMoveHistory: response.moves
      })
    })
    .catch(error => console.error(`Couldn't fetch move history: ${error.message}`))
  }

  toggleActivePlayer (gameId) {
    let changeActivePlayerRequest = {
      patchType: "switch-turns"
    }

    fetch(`/api/v1/games/${gameId}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      body: JSON.stringify(changeActivePlayerRequest)
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        let errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
    })
    .catch(error => console.error(`Error processing move: ${error.message}`))
  }

  render () {
    let loadingText = "Loading..."
    let pieceSet = 1
    let board = null
    if (this.state.fetchedMoves && this.state.fetchedGameData) {
      loadingText = null
      let opponentName = this.state.playerData.opponent.username
      let opponentColor = this.state.playerData.opponent.color
      let myName = this.state.playerData.user.username
      let myColor = this.state.myColor
      let gameId = this.props.params.id
      let toggleActivePlayer = () => { this.toggleActivePlayer(gameId) }
      // let broadcastMove = () => { this.broadcastMove(gameId) }
      board = <Board
        gameId={gameId}
        toggleActivePlayer={toggleActivePlayer}
        initialMoveHistory={this.state.initialMoveHistory}
        myColor={this.state.myColor}
        initiallyMyTurn={this.state.initiallyMyTurn}
        showLegalMoves={this.state.gameData.show_legal_moves}
        pieceSet={pieceSet}
        playerData={this.state.playerData}
      />
    }

    return(
      <div className="game-show-page">
        <BackButton />
        <div className="medium-12 large-6 columns">
          <h3 className="game-header">{loadingText}</h3>
          <div className="game-board">
            {board}
          </div>
        </div>
        <div className="medium-12 large-6 text-center columns">
          <h1>TEST</h1>
        </div>
      </div>
    )
  }
}

export default GameShow
