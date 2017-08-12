import React from 'react'

const GamePlaybackButtonsContainer = props => {
  let stepBackward = () => { props.stepThroughStateHistory(-1) }
  let stepForward = () => { props.stepThroughStateHistory(1) }
  let jumpToStart = () => { props.jumpToHistoryEndpoint('backward') }
  let jumpToNow = () => { props.jumpToHistoryEndpoint('forward') }
  let backwardIcon = '<'
  let forwardIcon = '>'
  let startIcon = '<<'
  let endIcon = '>>'
  let rewindCss = ''
  let forwardCss = ''
  if (props.upToDate) {
    forwardCss = 'maxed'
  } else {
    forwardCss = 'catch-up'
  }
  if (props.displayedStateIndex === 0) {
    rewindCss = 'maxed'
  }
  return(
    <div className="small-6 text-center playback-buttons-container small-centered columns">
      <span className={`playback outer button panel ${rewindCss}`} onClick={jumpToStart}>
        {startIcon}
      </span>
      <span className={`playback inner button panel ${rewindCss}`} onClick={stepBackward}>
        {backwardIcon}
      </span>
      <span className={`playback inner button panel ${forwardCss}`} onClick={stepForward}>
        {forwardIcon}
      </span>
      <span className={`playback outer button panel ${forwardCss}`} onClick={jumpToNow}>
        {endIcon}
      </span>
    </div>
  )
}

export default GamePlaybackButtonsContainer
