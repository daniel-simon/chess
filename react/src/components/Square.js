import React from 'react';
import Piece from './Piece';

const Square = props => {
  let foundationClass = ' small-1 text-center columns';
  let lastCol = (props.asViewedBy == 'white') ? 7 : 0
  if (props.col == lastCol) {
    foundationClass += ' end'
  }
  let highlightCssClass = '';
  if (props.selected) {
    highlightCssClass = ' selected';
  } else if (props.available) {
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
    <div onClick={props.handleClick} className={cssClass}>
      {occupant}
    </div>
  )
}

export default Square;
