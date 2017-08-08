import React, { Component } from 'react'
import Board from './Board'

class GameShow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetchedMoves: false,
      fetchedGameData: false,
      initialMoveHistory: [],
      gameData: {},
      activePlayerData: {},
      myColor: '',
      isMyTurn: null
    }
  }

  componentDidMount () {
    this.fetchMoveHistory()
    this.fetchGameData()
  }

  fetchGameData () {
    let gameId = this.props.params.id
    fetch(`/api/v1/games/${gameId}`, {
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
      let activePlayerData = playerData[playerData.active_player_label]
      let myColor = playerData.user.color
      let isMyTurn = playerData.active_player_label === 'user'
      this.setState({
        fetchedGameData: true,
        gameData: response.game_show_data,
        activePlayerData: activePlayerData,
        myColor: myColor,
        isMyTurn: isMyTurn
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`))
  }

  fetchMoveHistory () {
    let gameId = this.props.params.id
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

  render () {
    let board = null
    if (this.state.fetchedMoves && this.state.fetchedGameData) {
      board = <Board
        initialMoveHistory={this.state.initialMoveHistory}
        gameId={this.props.params.id}
        myColor={this.state.myColor}
        isMyTurn={this.state.isMyTurn}
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
