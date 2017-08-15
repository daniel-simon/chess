import React, { Component } from 'react'
import { browserHistory } from 'react-router'

class BackButton extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    browserHistory.goBack()
  }

  render () {

    return(
      <div className="button back-button" onClick={this.handleClick}>Back</div>
    )
  }
}

export default BackButton
