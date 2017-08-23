import React, { Component } from 'react'
import GameTile from '../components/GameTile'
import GetTimestampString from '../helpers/GetTimestampString'

const GamesListContainer = props => {

  let headerText = null
  let timestampColumn = ''
  if (props.games.length > 0) {
    switch (props.listType) {
    case 'active':
      headerText = 'Your Active Games'
      timestampColumn = 'relevant_timestamp'
      break
    case 'available':
      headerText = 'Available Games'
      timestampColumn = 'created_at'
      break
    case 'pending':
      headerText = 'Your Pending Games'
      timestampColumn = 'created_at'
      break
    }
  }

  let now = Date.now()
  props.games.forEach(gameObj => {
    gameObj.timestampStr = GetTimestampString(now, gameObj[timestampColumn])
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
      <div className="games-list-tiles">
        {gameTiles}
      </div>
    </div>
  )
}

export default GamesListContainer
