import React, { Component } from 'react'
import Board from './Board'

class GameShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
        initialMoveHistory: response.moves
      })
    })
    .catch(error => console.error(`Couldn't fetch move history: ${error.message}`))
  }


  render() {
    return(
      <div className="game-show">
        <Board
          initialMoveHistory={this.state.initialMoveHistory}
        />
      </div>
    )
  }
}

export default GameShow
