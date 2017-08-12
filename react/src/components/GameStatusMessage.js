import React from 'react'
let gameConstants = require('../helpers/GameConstants')

const GameStatusMessage = props => {
  let message
  switch (props.gameStatus[0]) {
  case 'check':
    message = `${props.gameStatus[1]} is in check!`
    break
  case 'checkmate':
    message = `Checkmate! ${gameConstants.enemyOf(props.gameStatus[1])} wins!`
    break
  case 'stalemate':
    message = `Stalemate! ${props.gameStatus[1]} has no legal moves`
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


export default GameStatusMessage
