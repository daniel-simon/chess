import React from 'react';
import { Link } from 'react-router'

const GameTile = props => {
  let creatorName = props.data.creator_name
  let gameId = props.data.id
  let showLegalMoves = props.data.show_legal_moves
  let createdStr = props.data.createdStr
  let updatedStr = props.data.updatedStr
  let showMovesText = showLegalMoves ? "enabled" : "disabled"

  return(
    <div className="row">
      <div className="small-12 medium-10 large-8 game-tile small-centered panel columns">
        <div className="row">
          <h3>
            <span className="game-created-by left">Game created by {creatorName}</span>
            <span className="time-created secondary right">{createdStr}</span>
          </h3>
        </div>
        <br />
        <p className="move-suggestions row">Move suggestions: {showMovesText}</p>
        <br />
        <Link to={`/games/${gameId}`}>
          <div
            className="button panel row"
            onClick={props.joinThisGame}
          >
            Join this game
          </div>
        </Link>
      </div>
    </div>
  )
}

export default GameTile
