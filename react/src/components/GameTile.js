import React from 'react'
import { Link } from 'react-router'

const GameTile = props => {
  let showMovesText = props.data.show_legal_moves ? 'enabled' : 'disabled'
  let gameId = props.data.id
  let opponentName = ''
  let opponentHeader = ''
  let timestampText = ''
  let buttonText = ''
  let turnText = ''
  let movesCountText = ''
  let enterGameButton = null
  let turnTextCssClass = 'turn-text-left'
  let tileCssClass = 'game-tile panel'
  let whiteKingSprite = <img src={require('../sprites/set1/whiteking.png')} />
  let blackKingSprite = <img src={require('../sprites/set1/blackking.png')} />
  let opponentSprite
  let userSprite
  let playerColorsDiv

  switch (props.tileType) {
  case 'active':
    opponentName = props.data.opponent_username
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
    if (props.data.white_id === props.data.opponent_id) {
      opponentSprite = whiteKingSprite
      userSprite = blackKingSprite
    } else {
      opponentSprite = blackKingSprite
      userSprite = whiteKingSprite
    }
    playerColorsDiv = (
      <div>
        You: {userSprite}
        {opponentName}: {opponentSprite}
      </div>
    )
    enterGameButton = (
      <Link to={`/games/${gameId}`} className="button panel row">
        Continue Game
      </Link>
    )
    break
  case 'available':
    let joinGame = () => {
      let payload = {
        patchRequest: {
          patchType: "join-game"
        }
      }
      fetch(`api/v1/games/${gameId}`, {
        credentials: 'same-origin',
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (response.redirected) {
          window.location.href = response.url
        } else {
          let errorMessage = `${response.status} (${response.statusText})`
          throw new Error(errorMessage)
        }
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`))
    }
    opponentName = props.data.creator_username
    opponentHeader = `${opponentName}'s game`
    timestampText = `Created: ${props.data.timestampStr}`
    tileCssClass += ' available-game'
    if (props.data.white_id === props.data.creator_id) {
      opponentSprite = whiteKingSprite
    } else {
      opponentSprite = blackKingSprite
    }
    playerColorsDiv = (
      <div>
        {opponentName}: {opponentSprite}
      </div>
    )
    enterGameButton = (
      <div className="button panel row" onClick={joinGame}>
        Join Game
      </div>
    )
    break
  case 'pending':
    opponentHeader = `Your game - no opponent yet`
    timestampText = `Created: ${props.data.timestampStr}`
    tileCssClass += ' available-game'
    if (props.data.white_id === props.data.creator_id) {
      userSprite = whiteKingSprite
    } else {
      userSprite = blackKingSprite
    }
    playerColorsDiv = (
      <div>
        You: {userSprite}
      </div>
    )
    break
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
          <div className="left">
            {playerColorsDiv}
          </div>
          <div className="right">
            {enterGameButton}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameTile
