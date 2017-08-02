// import './main.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'

document.addEventListener('DOMContentLoaded', function() {
  let gamesIndex = document.getElementById('games-index')

  if (gamesIndex) {
    ReactDOM.render(
      <App />,
      gamesIndex
    )
  }
})
