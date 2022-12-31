const { Markup } = require('telegraf');
const { store } = require('../store');
const {
  cancelLastChosenPlayerButton,
  changeSequenceButton,
  changeCaptainsButton,
} = require('./buttons');
const doesTeamsHaveSamePlayersQuantity = require('./does-teams-have-same-players-quantity');

module.exports = function getPlayerButtons(players, buttonsInString = 2) {
  const buttons = [];
  let currentIndex = 0;

  players.forEach(player => {
    const playerButton = Markup.button.callback(player, player);

    buttons[currentIndex] = buttons[currentIndex] ?? [];

    if (buttons[currentIndex].length < buttonsInString) {
      buttons[currentIndex].push(playerButton);
    } else {
      currentIndex++;
      buttons[currentIndex] = [playerButton];
    }
  });

  for (let i = buttons[currentIndex].length; i < buttonsInString; i++) {
    buttons[currentIndex].push(Markup.button.callback('-', '-'));
  }

  if (store.lastChosenPlayer) {
    currentIndex++;
    buttons[currentIndex] = cancelLastChosenPlayerButton;
  }

  if (doesTeamsHaveSamePlayersQuantity()) {
    currentIndex++;
    buttons[currentIndex] = changeSequenceButton;
  }

  currentIndex++;
  buttons[currentIndex] = changeCaptainsButton;

  return Markup.inlineKeyboard(buttons);
};
