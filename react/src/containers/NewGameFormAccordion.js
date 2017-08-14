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
    this.setState({ creatingGame: true, expanded: false })
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
        this.setState({ creatingGame: false })
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
    let accordion = null
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
          </div>
        </div>
      )
    }

    return (
      <div className={`row game-tile new-game-form-container panel ${cssToggle}`}>
        <h4 className={`games-list-header`}>
          Create A New Game &nbsp;
          <i className={faClass} aria-hidden="true" onClick={this.toggleAccordion} />
        </h4>
        {accordion}
      </div>
    )
  }
}

export default NewGameFormAccordion
