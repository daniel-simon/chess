import React from 'react'

const Piece = props => {

  let sprite = require(`../sprites/set${props.pieceSet}/${props.color}${props.type}.png`)

  return(
    <div className={`${props.color} piece text-center`}>
      <img src={sprite} />
    </div>
  )
}

export default Piece
