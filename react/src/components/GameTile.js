import React from 'react'

const GameTile = props => {
  let gameId = props.gameId
  let creatorName = props.creatorName
  let creatorEmail = props.creatorEmail
  let showLegalMoves = props.showLegalMoves
  let createdAt = props.createdAt

  return(
    <div className="game-tile callout row">
      <h3 className="left">Created by {creatorName}</h3>
      <a href={`games/${gameId}`}>
        Join this game
      </a>
    </div>
  )
}

export default GameTile
