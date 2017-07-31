import './main.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'

document.addEventListener('DOMContentLoaded', function() {
  let reactElement = document.getElementById('app')

  if (reactElement) {
    ReactDOM.render(
      <App />,
      reactElement
    )
  }
})
