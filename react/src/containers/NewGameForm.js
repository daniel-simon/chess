import React, { Component } from 'react'

class NewGameForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      colorSelection: null,
      creatingGame: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleRadioClick = this.handleRadioClick.bind(this)
  }

  handleSubmit () {
    this.setState({ creatingGame: true })
    let payload = {
      postRequest: {
        creatorColor: 'white'
      }
    }
    fetch(`/api/v1/games/`, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (response.ok) {
        this.setState({ creatingGame: false })
        this.props.refreshList()
      } else {
        let errorMessage = `${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }
    })
    .catch(error => console.error(`Error creating new game ${error.message}`))
  }

  handleRadioClick (option) {
    this.setState({ colorSelection: option })
  }

  render () {

    let selectWhite = () => { this.handleRadioClick('white') }
    let selectBlack = () => { this.handleRadioClick('black') }
    let buttonCssClass = 'button row'
    let handleCreateClick = () => { this.handleSubmit() }
    if (this.state.colorSelection == null || this.state.creatingGame) {
      buttonCssClass += ' unavailable'
      handleCreateClick = () => {}
    }

    return(
      <div className="small-12 small-centered columns">
        <h2 className="games-list-header">
          Create A New Game
        </h2>
        <div className="row">
          <div className="game-tile new-game-form-container panel">
            <div className="game-info-text">
              <p className="row">
                Choose your color:
              </p>
              <p className="row">
                <span onClick={selectWhite}>
                  <input
                    type="radio"
                    checked={this.state.colorSelection === 'white'}
                  />
                  &nbsp; White
                </span>
                <br />
                <span onClick={selectBlack}>
                  <input
                    type="radio"
                    checked={this.state.colorSelection === 'black'}
                  />
                  &nbsp; Black
                </span>
              </p>
            </div>
            <div className="row">
              <div className="right">
                <div className={buttonCssClass} onClick={handleCreateClick}>
                  Create Game
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NewGameForm
