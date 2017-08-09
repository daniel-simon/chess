import React from 'react'

const RefreshListButton = props => {

  return(
    <div className="refresh button" onClick={props.handleClick}>
      Refresh games list
    </div>
  )
}

export default RefreshListButton
