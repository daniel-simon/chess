import React from 'react';

const GameTile = props => {
  let creatorName = props.data.creator_name
  let gameId = props.data.id
  let showLegalMoves = props.data.show_legal_moves

  let showMovesText = showLegalMoves ? "enabled" : "disabled"
  let days = Math.floor(props.data.ageDay)
  let hours = Math.floor(props.data.ageHour - (24 * days))
  let minutes = Math.floor(props.data.ageMin - (60 * hours))
  let ageStr = ''
  if (days > 0) {
    ageStr += `${days} day`
    if (days > 1) {
      ageStr += `s`
    }
  }
  if (hours > 0) {
    ageStr += ` ${hours} hour`
    if (hours > 1) {
      ageStr += `s`
    }
  }
  if (minutes > 0) {
    ageStr += ` ${minutes} minute`
    if (minutes > 1) {
      ageStr += `s`
    }
  }
  return(
    <div className="game-tile panel row">
      <div className="small-2 columns"></div>
      <div className="small-8 columns">
        <div className="row">
          <h3 className="text-left">Game created by {creatorName}</h3>
          <h4 className="text-right">{ageStr} ago</h4>
        </div>
        <br />
        <p className="row">Move suggestions: {showMovesText}</p>
        <br />
        <a className="panel" href={`games/${gameId}`}>
          Join this game
        </a>
      </div>
      <div className="small-2 columns"></div>
    </div>
  )
}

export default GameTile
