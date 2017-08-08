import React, { Component } from 'react'
import GameTile from '../components/GameTile'
import AgeStringFromTimestamp from '../helpers/AgeStringFromTimestamp'

class GamesIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetched: false,
      games: []
    }
    this.handleGameJoin = this.handleGameJoin.bind(this)
  }

  componentDidMount () {
    this.refreshGamesList()
  }

  refreshGamesList () {
    this.setState({ fetched: false })
    fetch('/api/v1/games', {
      credentials: 'same-origin'
    })
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
      this.setState({
        fetched: true,
        games: response.games_index_data
      })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`))
  }

  handleGameJoin (gameId) {
    let joinGameRequest = { patchType: "join-game" }
    fetch(`/api/v1/games/${gameId}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      body: JSON.stringify(joinGameRequest)
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        let errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
    })
    .catch(error => console.error(`Error in fetch (patch): ${error.message}`))
  }

  render () {
    let gameTiles = []
    let availableGames = []
    if (this.state.fetched) {
      availableGames = this.state.games.filter(gameObj => {
        return (
          gameObj.started === false ||
          gameObj.playing_this_game === true
        )
      })
      let now = Date.now()
      availableGames.forEach(gameObj => {
        gameObj.createdStr = AgeStringFromTimestamp(now, gameObj.created_at)
        gameObj.updatedStr = AgeStringFromTimestamp(now, gameObj.updated_at)
      })
      gameTiles = availableGames.map(gameObj => {
        let joinThisGame = () => { this.handleGameJoin(gameObj.id) }
        return(
          <GameTile
            key={gameObj.id}
            data={gameObj}
            joinThisGame={joinThisGame}
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
