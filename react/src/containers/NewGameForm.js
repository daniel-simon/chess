import React, { Component } from 'react'

class NewGameForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      checked: false
    }
    this.toggleCheckBox = this.toggleCheckBox.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit () {

  }

  toggleCheckBox () {
    this.setState({ checked: !this.state.checked })
  }

  render () {

    return(
      <div>
        
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
