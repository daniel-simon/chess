import React, { Component } from 'react'
import Board from './Board'

class GameShow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetchedMoves: false,
      initialMoveHistory: []
    }
  }

  componentDidMount () {
    this.fetchMoveHistory()
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
    if (this.state.fetchedMoves) {
      board = <Board
        initialMoveHistory={this.state.initialMoveHistory}
        gameId={this.props.params.id}
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
