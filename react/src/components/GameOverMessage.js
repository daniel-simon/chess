import React, { Component } from 'react'
let gameConstants = require('../helpers/GameConstants')

class GameOverMessage extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    let message
    switch (this.props.gameOutcome[0]) {
    case 'checkmate':
      message = `Checkmate! ${gameConstants.enemyOf(this.props.gameOutcome[1])} wins!`
      break
    case 'stalemate':
      message = `Stalemate! ${this.props.gameOutcome[1]} has no legal moves`
      break
    }

    return(
      <div className="game-over-message small-12 small-centered columns">
        <div className="game-over-text">
          {message}
        </div>
      </div>
    )
  }
}

export default GameOverMessage
