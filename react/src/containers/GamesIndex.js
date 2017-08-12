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
        pendingGames: response.games_index_data.pending_games,
        activeGames: response.games_index_data.active_games,
        availableGames: response.games_index_data.available_games,
      })
    })
    .catch(error => console.error(error.message))
  }

  render () {
    let activeGamesList, availableGamesList, pendingGamesList
    let gamesListFoundationClass = ''
    let loadingHeader = (
      <h2 className="games-list-header loading-text">
        Loading...
      </h2>
    )
    if (this.state.fetched) {
      gamesListFoundationClass = "small-10 small-centered columns"
      loadingHeader = null
      pendingGamesList = (
        <GamesListContainer
          listType="pending"
          games={this.state.pendingGames}
        />
      )
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
    let refreshList = () => { this.loadGamesList() }
    return(
      <div>
        <div className={gamesListFoundationClass}>
          <NewGameForm
            refreshList={refreshList}
          />
          {loadingHeader}
          {pendingGamesList}
          {activeGamesList}
          {availableGamesList}
        </div>
      </div>
    )
  }
}

export default GamesIndex
