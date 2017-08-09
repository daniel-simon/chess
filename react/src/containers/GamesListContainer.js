import React, { Component } from 'react'
import GameTile from '../components/GameTile'

class GamesListContainer  {
  constructor (props) {
    super(props)
    this.handleGameJoin = this.handleGameJoin.bind(this)
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
    let gamesListType = this.props.gamesListType
    let games = this.props.games
    let gameTiles = games.map((gameObj, index) => {
      let handleClick = () => { this.handleGameJoin(gameObj.id) }
      return(
        <GameTile
          key={gameObj.id}
          tileType={gamesListType}
          data={gameObj}
          handleClick={this.props.handleTileButtonClick}
        />
      )
    })

    let gamesHeader
    if (games.length > 0) {
      switch(gamesListType) {
        case 'available':
        gamesHeader = (
          <h2 className="available games-list-container">Available Games</h2>
        )
        break
        case 'active':
        gamesHeader = (
          <h2 className="active games-list-container">Your Active Games</h2>
        )
        break
      }
    }

    return(
      <div>
        {gamesHeader}
        {gameTiles}
      </div>
    )
  }

}

export default GamesListContainer
