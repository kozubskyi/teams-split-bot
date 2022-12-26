const { store } = require('../store');
const { replies, getLineups, getPlayerButtons } = require('../helpers');
const { splitVariantButtons, teamsQuantityButtons } = require('../helpers/buttons');
const { getPrevChoosingTeam } = require('../helpers/get-choosing-team');
const handleError = require('./handle-error');

module.exports = async function handleLastChosenPlayerCancellation(ctx) {
  try {
    if (!store.splitVariant)
      return await ctx.reply(replies.firstChooseSplitVariantReply, splitVariantButtons);
    if (!store.teamsQuantity)
      return await ctx.reply(replies.fitstChooseTeamsQuantityReply, teamsQuantityButtons);
    if (!store.players.length) return await ctx.replyWithHTML(replies.sendPlayersListReply);
    if (!store.lastChosenPlayer) return;

    for (let team = 1; team <= store.teamsQuantity; team++) {
      if (!store.teamsData[team].includes(store.lastChosenPlayer)) continue;

      store.teamsData[team] = store.teamsData[team].filter(
        player => player !== store.lastChosenPlayer
      );
    }

    store.remainedPlayers.push(store.lastChosenPlayer);

    store.currentTeam = store.currentTeam === 1 ? store.teamsQuantity : store.currentTeam - 1;

    const currentPickCaptain = store.teamsData[getPrevChoosingTeam()][0].slice(0, -4);

    const { first_name, last_name, username } = ctx.callbackQuery.from;

    const reply = `
<i>ℹ️ ${first_name} ${last_name ? last_name : username} відмінив обрання гравця ${
      store.lastChosenPlayer
    } для команди ${store.currentTeam}</i>

Зараз обирає: <b>${currentPickCaptain}</b> ${getLineups()} ${replies.dontTouchPlayerButtons}
`;
    store.lastChosenPlayer = '';

    await ctx.replyWithHTML(reply, getPlayerButtons(store.remainedPlayers));
  } catch (err) {
    await handleError(err, ctx);
  }
};
