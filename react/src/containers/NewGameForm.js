import React, { Component } from 'react'

class NewGameForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      checked: false,
    }
    this.toggleCheckBox = this.toggleCheckBox.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit () {
    let payload = { newGame: { showLegalMoves: this.state.checked } }
    fetch(`/api/v1/games/`, {
      method: 'POST',
      credentials: 'same-origin',
      body: payload
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        let errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
    })
    .catch(error => console.error(`Error creating new game ${error.message}`))
  }

  toggleCheckBox () {
    this.setState({ checked: !this.state.checked })
  }

  render () {

    return(
      <div className="new-game-form-container">
        <input
          type="checkbox"
          checked={this.state.checked}
          onChange={this.toggleCheckBox}
        />
        <div className="button" onClick={this.handleSubmit}>
          Submit
        </div>
      </div>
    )
  }
}

export default NewGameForm
