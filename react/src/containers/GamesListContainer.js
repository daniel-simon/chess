import React, { Component } from 'react'
import GameTile from '../components/GameTile'
import GetTimestampString from '../helpers/GetTimestampString'

const GamesListContainer = props => {

  let headerText = null
  if (props.games.length > 0) {
    switch (props.listType) {
    case 'active':
      headerText = 'Your Active Games'
      break
    case 'available':
      headerText = 'Available Games'
      break
    case 'pending':
      headerText = 'Your Pending Games'
      break
    }
  }

  let now = Date.now()
  props.games.forEach(gameObj => {
    gameObj.timestampStr = GetTimestampString(now, gameObj.created_at)
  })
  let gameTiles = props.games.map(gameObj => {
    return(
      <GameTile
        key={gameObj.id}
        tileType={props.listType}
        data={gameObj}
      />
    )
  })

  return(
    <div>
      <h2 className="games-list-header">
        {headerText}
      </h2>
      {gameTiles}
    </div>
  )
}

export default GamesListContainer
