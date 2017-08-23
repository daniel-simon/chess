import React, { Component } from 'react'
import { Link } from 'react-router'

class GameTile extends Component {
  constructor (props) {
    super(props)
    this.state = { joiningGame: false }
  }

  joinGame () {
    this.setState({ joiningGame: true })
    let payload = {
      patchRequest: {
        patchType: "join-game"
      }
    }
    fetch(`api/v1/games/${this.props.data.id}`, {
      credentials: 'same-origin',
      method: 'PATCH',
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (response.redirected) {
        window.location.href = response.url
        this.setState({ joiningGame: false })
      } else {
        let errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`))
  }

  render () {
    let showMovesText = this.props.data.show_legal_moves ? 'enabled' : 'disabled'
    let gameId = this.props.data.id
    let opponentName = ''
    let opponentHeader = ''
    let timestampText = ''
    let buttonText = ''
    let turnText = ''
    let movesCountText = ''
    let turnTextCssClass = 'turn-text-left'
    let tileCssClass = 'game-tile panel'
    let whiteKingSprite = <img src={require('../sprites/set1/whiteking.png')} />
    let blackKingSprite = <img src={require('../sprites/set1/blackking.png')} />
    let opponentSprite
    let userSprite
    let playerColorsDiv
    let enterGameButton

    switch (this.props.tileType) {
    case 'active':
      opponentName = this.props.data.opponent_username
      opponentHeader = `Opponent: ${opponentName}`
      tileCssClass += ' active-game'
      if (this.props.data.my_turn) {
        tileCssClass += ' your-turn'
        turnTextCssClass += ' your-turn-text'
        turnText = "Your turn"
      } else {
        turnText = `${opponentName}'s turn`
      }
      if (this.props.data.moves_count > 0) {
        timestampText = `Last move: ${this.props.data.timestampStr}`
        movesCountText = `Total moves: ${this.props.data.moves_count}`
      } else {
        timestampText = `Game started: ${this.props.data.timestampStr}`
        movesCountText = `No moves yet`
      }
      if (this.props.data.white_id === this.props.data.opponent_id) {
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
      opponentName = this.props.data.creator_username
      opponentHeader = `${opponentName}'s game`
      timestampText = `Created: ${this.props.data.timestampStr}`
      tileCssClass += ' available-game'
      if (this.props.data.white_id === this.props.data.creator_id) {
        opponentSprite = whiteKingSprite
      } else {
        opponentSprite = blackKingSprite
      }
      playerColorsDiv = (
        <div>
          {opponentName}: {opponentSprite}
        </div>
      )
      let isButtonDisabled = this.state.joiningGame === true
      let isButtonDisabledCss = isButtonDisabled ? ' disabled' : ''
      enterGameButton = (
        <div className={`button panel row ${isButtonDisabledCss}`} onClick={this.joinGame}>
          Join Game
        </div>
      )
      break
    case 'pending':
      opponentHeader = `Your game - no opponent yet`
      timestampText = `Created: ${this.props.data.timestampStr}`
      tileCssClass += ' available-game'
      if (this.props.data.white_id === this.props.data.creator_id) {
        userSprite = whiteKingSprite
      } else {
        userSprite = blackKingSprite
      }
      playerColorsDiv = (
        <div>
          You: {userSprite}
        </div>
      )
      enterGameButton = null
      break
    }

    return (
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
}

export default GameTile
