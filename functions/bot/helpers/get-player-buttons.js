const { Markup } = require('telegraf');
const { store } = require('../store');

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

  if (store.lastChosenPlayer)
    buttons[currentIndex + 1].push(
      Markup.button.callback('Відмінити останній вибір', 'cancel_last_chosen_player')
    );

  return Markup.inlineKeyboard(buttons);
};
