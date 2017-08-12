import React from 'react'
import GamesIndex from './GamesIndex'
import NewGameForm from './NewGameForm'

const GamesPage = props => {

  return(
    <div>
      <div className="small-2 text-center columns">
        <NewGameForm />
      </div>
      <div className="small-10 small-centered columns">
        <GamesIndex />
      </div>
    </div>
  )
}

export default GamesPage
