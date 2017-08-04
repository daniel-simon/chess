import React from 'react';
import ReactDOM from 'react-dom';
import GameShowPage from './containers/GameShowPage';
import GamesIndexPage from './containers/GamesIndexPage';

document.addEventListener('DOMContentLoaded', function() {
  let gameShowPage = document.getElementById('game-show');
  let gamesIndexPage = document.getElementById('games-index');

  if (gameShowPage) {
    ReactDOM.render(
      <GameShowPage />,
      gameShowPage
    )
  }

  if (gamesIndexPage) {
    ReactDOM.render(
      <GamesIndexPage />,
      gamesIndexPage
    )
  }
})
