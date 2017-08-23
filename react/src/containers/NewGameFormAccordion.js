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
    this.toggleAccordion = this.toggleAccordion.bind(this)
  }

  handleSubmit () {
    this.setState({ creatingGame: true })
    let payload = {
      postRequest: {
        creatorColor: this.state.colorSelection
      }
    }
    fetch(`/api/v1/games/`, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (response.ok) {
        this.setState({ creatingGame: false, colorSelection: null })
        this.props.handleCreateGame()
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

  toggleAccordion () {
    this.setState({ expanded: !this.state.expanded })
  }

  render () {
    let plusIcon = 'fa fa-plus-square-o fa-lg'
    let minusIcon = 'fa fa-minus-square-o fa-lg'
    let accordionBody = null
    let cssToggle = 'hidden'
    let faClass = plusIcon
    if (this.state.expanded) {
      faClass = minusIcon
      cssToggle = ''
      let selectWhite = () => { this.handleRadioClick('white') }
      let selectBlack = () => { this.handleRadioClick('black') }
      let buttonCssClass = ' button'
      let handleSubmitClick = () => { this.handleSubmit() }
      if (this.state.colorSelection == null || this.state.creatingGame) {
        buttonCssClass += ' disabled'
        handleSubmitClick = () => {}
      }

      let whiteButtonSpan = (
        <span className="color-selection-radio" onClick={selectWhite}>
          <input
            type="radio"
            checked={this.state.colorSelection === 'white'}
          />
          <img src={require('../sprites/set1/whiteking.png')} />
        </span>
      )

      let blackButtonSpan = (
        <span className="color-selection-radio" onClick={selectBlack}>
          <input
            type="radio"
            checked={this.state.colorSelection === 'black'}
          />
          <img src={require('../sprites/set1/blackking.png')} />
        </span>
      )

      accordionBody = (
        <div>
          <div className="new-game-form-accordion">
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
          </div>
        </div>
      )
    }

    return (
      <div className={`row game-tile new-game-form-container panel text-center ${cssToggle}`}>
        <div className="accordion-title button" onClick={this.toggleAccordion}>
          <i className={faClass} aria-hidden="true" />
          &nbsp; Create A New Game
        </div>
        <div className="accordion-body">
          {accordionBody}
        </div>
      </div>
    )
  }
}

export default NewGameFormAccordion
