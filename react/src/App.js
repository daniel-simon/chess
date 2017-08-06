import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import GameShow from './containers/GameShow'
import GamesIndex from './containers/GamesIndex'

const App = props => {

  return(
    <div>
      <Router history={browserHistory}>
        <Route path='/games' component={GamesIndex} />
        <Route path='/games/:id' component={GameShow} />
      </Router>
    </div>
  )
}

export default App
