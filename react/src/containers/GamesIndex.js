import React, { Component } from 'react'
import NewGameFormAccordion from './NewGameFormAccordion'
import BackButton from '../components/BackButton'
import GamesListContainer from './GamesListContainer'

class GamesIndex extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fetched: false,
      pendingGames: [],
      activeGames: [],
      availableGames: [],
      myId: null
    }
    this.loadGamesList = this.loadGamesList.bind(this)
    this.handleCreateGame = this.handleCreateGame.bind(this)
  }

  handleCreateGame () {
    debugger
    this.loadGamesList()
    console.log(`sent cue`)
    App.gamesIndexChannel.send({
      senderId: this.state.myId,
    })
  }

  componentDidMount () {
    this.loadGamesList()
    this.subscribeToGamesIndexChannel()
  }

  subscribeToGamesIndexChannel () {
    let loadGamesList = () => { this.loadGamesList() }
    let myId = this.state.myId
    App.gamesIndexChannel = App.cable.subscriptions.create(
      {
        channel: "GamesIndexChannel"
      },
      {
        connected: () => console.log("GamesIndexChannel connected"),
        disconnected: () => console.log("GamesIndexChannel disconnected"),
        received: (fetchCue) => {
          console.log(`recieved cue from user with id ${fetchCue.senderId}`)
          if (fetchCue.senderId !== myId) {
            loadGamesList()
          }
        }
      }
    )
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
        myId: response.games_index_data.user_id
      })
    })
    .catch(error => console.error(error.message))
  }

  render () {
    let activeGamesList, availableGamesList, pendingGamesList
    let loadingHeader = (
      <h2 className="games-list-header loading-text">
        Loading...
      </h2>
    )
    if (this.state.fetched) {
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

    return(
      <div className="row">
        <div className="row">
          <div className="small-10 small-centered medium-4 medium-end medium-right columns">
            <NewGameFormAccordion refreshList={this.handleCreateGame} />
          </div>
          <div className="small-10 small-centered medium-8 columns">
            {loadingHeader}
            {pendingGamesList}
            {activeGamesList}
            {availableGamesList}
          </div>
        </div>
      </div>
    )
  }
}

export default GamesIndex
