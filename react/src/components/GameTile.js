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
  let movesCountText = ''
  let whiteName, blackName

  if (props.data.white_id === props.data.opponent_id) {
    whiteName = props.data.opponent_username
    blackName = 'You'
  } else {
    blackName = props.data.opponent_username
    whiteName = 'You'
  }

  switch (props.tileType) {
  case 'active':
    let opponentName = props.data.opponent_username
    opponentHeader = `Game against ${opponentName}`
    cssClass = 'active-game'
    if (props.data.my_turn) {
      cssClass += ' my-turn'
      turnText = "Your turn"
    } else {
      turnText = `${opponentName}'s turn`
    }
    movesCountText = `Total moves: ${props.data.moves_count}`
    if (props.data.moves_count > 0) {
      timestampText = `Last move made ${props.data.timestampStr}`
    } else {
      timestampText = `Game started ${props.data.timestampStr}`
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
        <div className="game-info-text">
          <p className="row">
            <span className="turn-text left">{turnText}</span>
            <span className="move-suggestions-text right">Move suggestions: {showMovesText}</span>
          </p>
          <p className="row">
            <span className="moves-count-text left">{movesCountText}</span>
          </p>
        </div>
        <div className="row">
          <div className="right">
            <Link to={`/games/${gameId}`} className="button panel row">
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameTile
