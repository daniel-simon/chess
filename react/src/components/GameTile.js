import React from 'react';
import { Link } from 'react-router'

const GameTile = props => {
  let creatorName = props.data.creator_name
  let gameId = props.data.id
  let showLegalMoves = props.data.show_legal_moves

  let showMovesText = showLegalMoves ? "enabled" : "disabled"
  let days = Math.floor(props.data.ageDay)
  let hours = Math.floor(props.data.ageHour - (24 * days))
  let minutes = Math.floor(props.data.ageMin - (60 * hours) - (60 * 24 * days))
  let ageStr = ''
  // let units = { day: days, hour: hours, minute: minutes }
  // for (let unit in units) {
  //   let quantity = units[unit]
  // }

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
    <div className="row">
      <div className="small-12 medium-10 large-8 game-tile small-centered panel columns">
        <div className="row">
          <h3>
            <span className="game-created-by left">Game created by {creatorName}</span>
            <span className="time-created secondary right">{ageStr}</span>
          </h3>
        </div>
        <br />
        <p className="move-suggestions row">Move suggestions: {showMovesText}</p>
        <br />
        <Link to={`/games/${gameId}`}>
          <div
            className="join-button row button panel"
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
