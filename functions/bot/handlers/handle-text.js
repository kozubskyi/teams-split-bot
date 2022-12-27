const { store, resetStore } = require('../store');
const helpers = require('../helpers');
const { buttons } = require('../helpers');
const textHandlers = require('./text-handlers');
const splitHandlers = require('./split-handlers');
const handleError = require('./handle-error');

module.exports = async function handleText(ctx) {
  try {
    if (!store.splitVariant || !store.teamsQuantity) return;

    const splitSymbols = ['.', ')', '-'];

    store[store.list] = ctx.message.text.split('\n').map(playerString => {
      playerString = playerString.replace('-/+', '');
      playerString = playerString.replace('+/-', '');
      playerString = playerString.replace('+', '');

      for (let i = 0; i < playerString.length; i++) {
        if (splitSymbols.includes(playerString[i]) && !Number.isNaN(Number(playerString[i - 1]))) {
          playerString = playerString.replace(playerString[i], '~');
        }
      }

      const playerArray = playerString.split('~');
      return playerArray.length === 1 ? playerArray[0].trim() : playerArray[1].trim();
    });

    if (store.list === 'captains') {
      await textHandlers.handleCaptains(ctx);
    }
    if (store.list === 'players') {
      await textHandlers.handlePlayers(ctx);
    }
  } catch (err) {
    await handleError(err, ctx);
  }
};
