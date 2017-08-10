import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import GameShow from './containers/GameShow'
import GamesIndex from './containers/GamesIndex'
import NewGameForm from './containers/NewGameForm'

const App = props => {

  return(
    <div>
      <Router history={browserHistory}>
        <Route path='/games' component={GamesIndex} />
        <Route path='/games/:id' component={GameShow} />
        <Route path='/games/new' component={NewGameForm} />
      </Router>
    </div>
  )
}

export default App
