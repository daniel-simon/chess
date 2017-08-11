import React, { Component } from 'react'
import NewGameForm from './NewGameForm'
import BackButton from '../components/BackButton'
import GamesListContainer from './GamesListContainer'

class GamesIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetched: false,
      activeGames: [],
      availableGames: [],
    }
    this.loadGamesList = this.loadGamesList.bind(this)
  }

  componentDidMount () {
    this.loadGamesList()
  }

  loadGamesList () {
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

    let activeGamesList, availableGamesList, pendingGamesList
    
    if (this.state.fetched) {
      activeGamesList = (
        <GamesListContainer
          listType="active"
          games={this.state.activeGames}
        />
      )
      availableGamesList = (
        <GamesListContainer
          listType="available"
          games={this.state.availableGames}
        />
      )
    }
    return(
      <div>
        {activeGamesList}
        {availableGamesList}
      </div>
    )
  }
}

export default GamesIndex
