import React, { Component } from 'react'
import GameTile from '../components/GameTile'
import GetTimestampString from '../helpers/GetTimestampString'
import NewGameForm from './NewGameForm'

class GamesIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetched: false,
      activeGames: [],
      availableGames: [],
    }
    this.refreshGamesList = this.refreshGamesList.bind(this)
  }

  componentDidMount () {
    this.refreshGamesList()
  }

  refreshGamesList () {
    console.log('refreshed')
    fetch('/api/v1/games', {
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        let errorMessage = `Error refreshing list: ${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
    })
    .then(response => {
      this.setState({
        fetched: true,
        activeGames: response.games_index_data.active_games,
        availableGames: response.games_index_data.available_games
      })
    })
    .catch(error => console.error(error.message))
  }

  render () {
    let activeGames = []
    let activeGameTiles = []
    let activeGamesHeader = null
    let availableGames = []
    let availableGameTiles = []
    let availableGamesHeader = null
    if (this.state.fetched) {
      activeGames = this.state.activeGames
      availableGames = this.state.availableGames
      let now = Date.now()
      availableGames.forEach(gameObj => {
        gameObj.timestampStr = GetTimestampString(now, gameObj.created_at)
      })
      activeGames.forEach(gameObj => {
        gameObj.timestampStr = GetTimestampString(now, gameObj.updated_at)
      })
      activeGameTiles = activeGames.map(gameObj => {
        return(
          <GameTile
            key={gameObj.id}
            tileType="active"
            data={gameObj}
          />
        )
      })
      availableGameTiles = availableGames.map(gameObj => {
        return(
          <GameTile
            key={gameObj.id}
            tileType="available"
            data={gameObj}
          />
        )
      })
      if (activeGames.length > 0) {
        activeGamesHeader = (
          <h2 className="active-games">Your active games</h2>
        )
      }
      if (availableGames.length > 0) {
        availableGamesHeader = (
          <h2 className="public-games">Public games</h2>
        )
      }
    }
    return(
      <div>
        <NewGameForm />
        {activeGamesHeader}
        {activeGameTiles}
        {availableGamesHeader}
        {availableGameTiles}
      </div>
    )
  }
}

export default GamesIndex
