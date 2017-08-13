import React, { Component } from 'react'

class NewGameFormAccordion extends Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: false,
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
    let toggleAccordion = () => { this.setState({ expanded: !this.state.expanded }) }
    let selectWhite = () => { this.handleRadioClick('white') }
    let selectBlack = () => { this.handleRadioClick('black') }
    let buttonCssClass = ' button'
    let handleSubmitClick = () => { this.handleSubmit() }
    if (this.state.colorSelection == null || this.state.creatingGame) {
      buttonCssClass += ' unavailable'
      handleSubmitClick = () => {}
    }

    let whiteButtonSpan = (
      <span onClick={selectWhite}>
        <input
          type="radio"
          checked={this.state.colorSelection === 'white'}
        />
        &nbsp; White
      </span>
    )

    let blackButtonSpan = (
      <span onClick={selectBlack}>
        <input
          type="radio"
          checked={this.state.colorSelection === 'black'}
        />
        &nbsp; Black
      </span>
    )

    let accordion = null
    let cssToggle = 'hidden button'
    let handleDivClick = () => { toggleAccordion() }
    if (this.state.expanded) {
      handleDivClick = () => {}
      cssToggle = ''
      accordion = (
        <div>
          <div className="game-info-text">
            <p className="row">
              Choose your color:
            </p>
            <p className="row">
              {whiteButtonSpan}
              <br />
              {blackButtonSpan}
            </p>
          </div>
          <div className="row">
            <div className="right">
              <div className={`${buttonCssClass}`} onClick={handleSubmitClick}>
                Create Game
              </div>
            </div>
            <div className="left">
              <div className="button" onClick={toggleAccordion}>
                Collapse
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        className={`row game-tile new-game-form-container panel ${cssToggle}`}
        onClick={handleDivClick}
      >
        <h4 className={`games-list-header`} >
          Create A New Game
        </h4>
        {accordion}
      </div>
    )
  }
}

export default NewGameFormAccordion
