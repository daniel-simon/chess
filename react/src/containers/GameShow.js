import React, { Component } from 'react'
import Board from './Board'

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
      isMyTurn: null
    }
    this.toggleActivePlayer = this.toggleActivePlayer.bind(this)
  }

  componentDidMount () {
    this.fetchMoveHistory()
    this.fetchGameData()
  }

  componentDidUpdate () {
    if (
      this.state.activePlayerData.color === this.state.myColor &&
      this.state.isMyTurn === false
    ) {
        this.setState({ isMyTurn: true })
    } else if (
      this.state.activePlayerData.color !== this.state.myColor &&
      this.state.isMyTurn === true
    ) {
        this.setState({ isMyTurn: false })
    }
  }

  fetchGameData () {
    fetch(`/api/v1/games/${this.props.params.id}`, {
      credentials: 'same-origin'
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
      let playerData = response.game_show_data.player_data
      let activePlayerData = playerData[playerData.initial_active_player_label]
      let myColor = playerData.user.color
      let isMyTurn = playerData.active_player_label === 'user'
      this.setState({
        fetchedGameData: true,
        gameData: response.game_show_data,
        playerData: playerData,
        activePlayerData: activePlayerData,
        myColor: myColor,
        isMyTurn: isMyTurn
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`))
  }

  fetchMoveHistory () {
    fetch(`/api/v1/games/${this.props.params.id}/moves`, {
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

  toggleActivePlayer () {
    let currentlyMyTurn = this.state.isMyTurn
    let nextActivePlayerLabel = currentlyMyTurn ? 'opponent' : 'user'
    let nextActivePlayerData = this.state.playerData[nextActivePlayerLabel]

    let changeActivePlayerRequest = {
      patchType: "switch-turns",
      activeColor: nextActivePlayerData.color
    }
    fetch(`/api/v1/games/${this.props.params.id}`,{
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
    .then(response => {
      this.setState({
        activePlayerData: nextActivePlayerData
      })
    })
    .catch(error => console.error(`Error processing move: ${error.message}`))
  }

  render () {
    let pieceSet = 1
    let board = null
    if (this.state.fetchedMoves && this.state.fetchedGameData) {
      board = <Board
        initialMoveHistory={this.state.initialMoveHistory}
        gameId={this.props.params.id}
        myColor={this.state.myColor}
        isMyTurn={this.state.isMyTurn}
        toggleActivePlayer={this.toggleActivePlayer}
        pieceSet={pieceSet}
      />
    }

    return(
      <div className="game-show-page">
        <div className="game-board">
          {board}
        </div>
      </div>
    )
  }
}

export default GameShow
