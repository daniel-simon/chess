import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import GameShow from './containers/GameShow'
import GamesPage from './containers/GamesPage'

const App = props => {

  return(
    <div>
      <Router history={browserHistory}>
        <Route path='/games' component={GamesPage} />
        <Route path='/games/:id' component={GameShow} />
      </Router>
    </div>
  )
}

export default App
