import React from 'react';

const GameTile = props => {
  let creatorName = props.data.creator_name
  let gameId = props.data.id
  let showLegalMoves = props.data.show_legal_moves

  let showMovesText = showLegalMoves ? "enabled" : "disabled"
  let days = Math.floor(props.data.ageDay)
  let hours = Math.floor(props.data.ageHour - (24 * days))
  let minutes = Math.floor(props.data.ageMin - (60 * hours) - (60 * 24 * days))
  let ageStr = ''
  if (days > 0) {
    ageStr += `${days} day`
    if (days > 1) {
      ageStr += 's'
    }
  }
  if (hours > 0) {
    ageStr += ` ${hours} hour`
    if (hours > 1) {
      ageStr += 's'
    }
  }
  if (minutes > 0) {
    ageStr += ` ${minutes} minute`
    if (minutes > 1) {
      ageStr += 's'
    }
  }
  if (ageStr.length === 0) {
    ageStr = 'Just now'
  } else {
    ageStr += ' ago'
  }
  return(
    <div className="game-tile panel row">
      <div className="small-2 columns"></div>
      <div className="small-8 columns">
        <div className="row">
          <h3 className="text-left">Game created by {creatorName}</h3>
          <h3 className="text-right">{ageStr}</h3>
        </div>
        <br />
        <p className="row">Move suggestions: {showMovesText}</p>
        <br />
        <a href={`/games/${gameId}`}>
          <div
            className="join-button row button panel"
            onClick={props.joinThisGame}
          >
            Join this game
          </div>
        </a>
      </div>
      <div className="small-2 columns"></div>
    </div>
  )
}

export default GameTile
