import React from 'react';
import { Link } from 'react-router'

const GameTile = props => {
  let showMovesText = props.data.show_legal_moves ? 'enabled' : 'disabled'
  let gameId = props.data.id
  let opponentHeader = ''
  let timestampText = ''
  let cssClass = ''
  let buttonText = ''
  let turnText = ''

  switch (props.tileType) {
  case 'active':
    let opponentName = props.data.opponent_username
    opponentHeader = `Game against ${opponentName}`
    timestampText = `Last move made ${props.data.timestampStr}`
    cssClass = 'active-game'
    if (props.data.my_turn) {
      cssClass += ' my-turn'
      turnText = "Your turn"
    } else {
      turnText = `${opponentName}'s turn`
    }
    buttonText = "Continue Game"
    break
  case 'available':
    opponentHeader = `Open game created by ${props.data.creator_username}`
    timestampText = `Created ${props.data.timestampStr}`
    cssClass = 'available-game'
    buttonText = "Join Game"
    break
  }

  return(
    <div className="row">
      <div className={cssClass + " game-tile small-12 medium-10 large-8 game-tile small-centered panel columns"}>
        <div className="row">
          <h3>
            <span className="opponent-header left">{opponentHeader}</span>
            <span className="timestamp secondary right">{timestampText}</span>
          </h3>
        </div>
        <br />
        <div className="row">
          <p className="game-info-text">
            <span className="left">Move suggestions: {showMovesText}</span>
            <span className="turn-text right">{turnText}</span>
          </p>
        </div>
        <br />
        <Link to={`/games/${gameId}`}>
          <div className="button panel row" onClick={props.handleClick}>
            {buttonText}
          </div>
        </Link>
      </div>
    </div>
  )
}

export default GameTile
