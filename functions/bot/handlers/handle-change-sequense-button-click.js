const { store } = require('../store');
const { replies, getLineups, getPlayerButtons } = require('../helpers');
const { getNextChoosingTeam, getPrevChoosingTeam } = require('../helpers/get-choosing-team');
const handleError = require('./handle-error');

module.exports = async function handleChangeCaptainsButtonClick(ctx) {
  try {
    if (
      !store.splitVariant ||
      !store.teamsQuantity ||
      !store.players.length ||
      !store.captains.length
    )
      return;

    store.lastChosenPlayer = ''
    store.sequense = store.sequense === 'straight' ? 'reverse' : 'straight';

    if (store.sequense === 'reverse') {
      store.currentTeam = getPrevChoosingTeam();
    } else {
      store.currentTeam = getNextChoosingTeam();
    }

    const currentPickCaptain = store.teamsData[store.currentTeam][0].slice(3, -4);

    const { first_name, last_name } = ctx.callbackQuery.from;

    const reply = `
<i>ℹ️ ${first_name}${last_name ? ` ${last_name}` : ''} вирішив змінити послідовність вибору</i>

Зараз обирає: <b>${currentPickCaptain}</b> ${getLineups()} ${replies.dontTouchPlayerButtons}
`;
    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id);
    await ctx.replyWithHTML(reply, getPlayerButtons(store.remainedPlayers));
  } catch (err) {
    await handleError(err, ctx);
  }
};
