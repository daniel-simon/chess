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
    let headerText = "Loading..."
    let pieceSet = 1
    let board = null
    if (this.state.fetchedMoves && this.state.fetchedGameData) {
      let opponentName = this.state.playerData.opponent.username
      let opponentColor = this.state.playerData.opponent.color
      let myName = this.state.playerData.user.username
      let myColor = this.state.myColor
      board = <Board
        gameId={this.props.params.id}
        toggleActivePlayer={this.toggleActivePlayer}
        initialMoveHistory={this.state.initialMoveHistory}
        myColor={this.state.myColor}
        isMyTurn={this.state.isMyTurn}
        showLegalMoves={this.state.gameData.show_legal_moves}
        pieceSet={pieceSet}
      />
      if (this.state.isMyTurn) {
        headerText = `Your turn (${myColor})`
      } else {
        headerText = `${opponentName}'s turn (${opponentColor})`
      }
    }

    return(
      <div className="game-show-page">
        <div className="small-12 columns">
          <h3 className="game-header">{headerText}</h3>
          <div className="game-board">
            {board}
          </div>
        </div>
        <div className="small-12 text-center columns">
          <h1>TEST</h1>
        </div>
      </div>
    )
  }
}

export default GameShow
