import React, { Component } from 'react'
import GameTile from '../components/GameTile'

class GamesIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetched: false,
      games: []
    }
  }

  componentDidMount () {
    fetch('/api/v1/games')
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        let errorMessage = `${response.status} (${response.statusText})`
        let error = new Error(errorMessage)
        throw(error)
      }
    })
    .then(response => {

      this.setState({ fetched: true, games: response.games })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`))
  }

  render() {
    let gameTiles = []
    let availableGames = []
    if (this.state.fetched) {
      availableGames = this.state.games.filter(gameObj => {
        return(
          gameObj.started === false
          // && gameObj.public_game === true
        )
      })
      gameTiles = availableGames.map(gameObj => {
        return(
          <GameTile
            key={gameObj.id}
            gameId={gameObj.id}
            creatorName={gameObj.creator.username}
            creatorEmail={gameObj.creator.email}
            showLegalMoves={gameObj.show_legal_moves}
            createdAt={gameObj.created_at}
          />
        )
      })
    }
    return(
      <div>
        <h2 className="public-games">Public games</h2>
        {gameTiles}
      </div>
    )
  }
}

export default GamesIndex
