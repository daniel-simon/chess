import React, { Component } from 'react'
import GameTile from '../components/GameTile'

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
      this.setState({ fetched: true, games: response.games })
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`))
  }

  handleGameJoin (gameId) {
    fetch(`/api/v1/games/${gameId}`, {
      method: 'PATCH',
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
        let ageMs = now - Date.parse(gameObj.created_at)
        let ageSec = ageMs / 1000
        gameObj.ageMin = ageSec / 60
        gameObj.ageHour = gameObj.ageMin / 60
        gameObj.ageDay = gameObj.ageHour / 24
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
