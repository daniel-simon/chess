import React from 'react';
import Piece from './Piece';
import GameOverMessage from './GameOverMessage'

const Square = props => {
  let foundationClass = ' small-1 text-center columns';
  let lastCol = (props.asViewedBy === 'white') ? 7 : 0
  if (props.col == lastCol) {
    foundationClass += ' end'
  }

  let topLeft = (props.asViewedBy === 'white') ? (props.row === 7 && props.col === 0) : (props.row === 0 && props.col === 7)
  let messageDiv = null
  if (topLeft && props.showMessageBool) {
    messageDiv = (
      <div onClick={props.handleHideMessage}>
        <GameOverMessage gameOutcome={props.gameOutcome} />
      </div>
    )
  }
  let highlightCssClass = '';
  if (props.selected) {
    highlightCssClass = ' selected';
  } else if (props.showLegalMoves && props.available) {
    highlightCssClass = (props.victim) ? ' victim' : ' available'
  }
  if (props.selectable) {
    highlightCssClass += ' selectable'
  }

  let squareColors = ['black', 'white'];
  let colorIndex = (props.col + props.row) % 2;

  let cssClass = `${squareColors[colorIndex]}${highlightCssClass}${foundationClass} square`

  let occupant = null;
  if (props.occupant) {
    occupant = <Piece
      color={props.occupant.color}
      type={props.occupant.type}
      pieceSet={props.pieceSet}
    />
  }

  return(
    <div>
      {messageDiv}
      <div onClick={props.handleClick} className={cssClass}>
        {occupant}
      </div>
    </div>
  )
}

export default Square;
