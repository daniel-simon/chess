import React from 'react'
import { Link } from 'react-router'

const GameTile = props => {
  let showMovesText = props.data.show_legal_moves ? 'enabled' : 'disabled'
  let gameId = props.data.id
  let opponentHeader = ''
  let timestampText = ''
  let buttonText = ''
  let turnText = ''
  let movesCountText = ''
  let whiteName, blackName
  let turnTextCssClass = 'turn-text-left'
  let tileCssClass = 'game-tile panel'

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
    opponentHeader = `Opponent: ${opponentName}`
    tileCssClass += ' active-game'
    if (props.data.my_turn) {
      tileCssClass += ' your-turn'
      turnTextCssClass += ' your-turn-text'
      turnText = "Your turn"
    } else {
      turnText = `${opponentName}'s turn`
    }
    if (props.data.moves_count > 0) {
      timestampText = `Last move: ${props.data.timestampStr}`
      movesCountText = `Total moves: ${props.data.moves_count}`
    } else {
      timestampText = `Game started: ${props.data.timestampStr}`
      movesCountText = `No moves yet`
    }
    buttonText = "Continue Game"
    break
  case 'available':
    opponentHeader = `${props.data.creator_username}'s game`
    timestampText = `Created: ${props.data.timestampStr}`
    tileCssClass += ' available-game'
    buttonText = "Join Game"
    break
  case 'pending':
    opponentHeader = `Your game - no opponent yet`
    timestampText = `Created: ${props.data.timestampStr}`
    tileCssClass += ' available-game'
    break
  }
  let enterGameButton = (
    <Link to={`/games/${gameId}`} className="button panel row">
      {buttonText}
    </Link>
  )
  if (props.tileType === 'pending') {
    enterGameButton = null
  }

  return(
    <div className="row">
      <div className={tileCssClass}>
        <div className="row">
          <h3>
            <span className="opponent-header left">{opponentHeader}</span>
            <span className="timestamp secondary right">{timestampText}</span>
          </h3>
        </div>
        <br />
        <div className="game-info-text">
          <p className="row">
            <span className={turnTextCssClass}>{turnText}</span>
          </p>
          <p className="row">
            <span className="moves-count-text left">{movesCountText}</span>
          </p>
        </div>
        <div className="row">
          <div className="right">
            {enterGameButton}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameTile
