const { store } = require('../store');
const { buttons } = require('../helpers');
const handleError = require('./handle-error');

module.exports = async function handleChangeCaptainsButtonClick(ctx) {
  try {
    if (!store.splitVariant || !store.teamsQuantity || !store.players.length) return;

    store.captains = [];
    store.remainedPlayers = [];
    store.remainedCaptains = [];
    store.captainsChoice = '';
    for (let i = 1; i <= store.teamsQuantity; i++) store.teamsData[i] = [];
    store.currentTeam = 0;
    store.lastChosenPlayer = '';

    const { first_name, last_name, username } = ctx.callbackQuery.from;

    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id);
    await ctx.replyWithHTML(
      `
<i>ℹ️ ${first_name} ${last_name ? last_name : username} вирішив обрати інших капітанів</i>

Натисність на кнопку нижче і я самостійно випадковим чином оберу капітанів зі списку гравців, або відправте список з ${
        store.teamsQuantity
      }-х капітанів.
`,
      buttons.randomCaptainsButton
    );

    store.list = 'captains';
  } catch (err) {
    await handleError(err, ctx);
  }
};
