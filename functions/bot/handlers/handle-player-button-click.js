const { store, resetStore } = require('../store');
const {
  replies,
  getNextChoosingTeam,
  getButtonText,
  getLineups,
  getPlayerButtons,
  sendInfoMessageToCreator,
} = require('../helpers');
const { splitVariantButtons, teamsQuantityButtons } = require('../helpers/buttons');
const handleError = require('./handle-error');

module.exports = async function handlePlayerButtonClick(ctx) {
  try {
    const clickedPlayer = ctx.callbackQuery.data;
    if (clickedPlayer === '-' || !store.remainedPlayers.includes(clickedPlayer)) return;

    if (!store.splitVariant)
      return await ctx.reply(replies.firstChooseSplitVariantReply, splitVariantButtons);
    if (!store.teamsQuantity)
      return await ctx.reply(replies.fitstChooseTeamsQuantityReply, teamsQuantityButtons);
    if (!store.players.length) return await ctx.replyWithHTML(replies.sendPlayersListReply);

    store.currentTeam = store.currentTeam === store.teamsQuantity ? 1 : store.currentTeam + 1;
    store.lastChosenPlayer = clickedPlayer;

    store.teamsData[store.currentTeam].push(clickedPlayer);

    store.remainedPlayers.splice(store.remainedPlayers.indexOf(clickedPlayer), 1);

    const currentPickCaptain = store.teamsData[getNextChoosingTeam()][0].slice(0, -4);

    let reply = '';

    if (store.remainedPlayers.length > 1) {
      const { first_name, last_name, username } = ctx.callbackQuery.from;

      reply = `
<i>ℹ️ ${first_name} ${last_name ? last_name : username} для команди ${
        store.currentTeam
      } обрав гравця: ${clickedPlayer}</i>

Зараз обирає: <b>${currentPickCaptain}</b> ${getLineups()} ${replies.dontTouchPlayerButtons}
`;
      await ctx.replyWithHTML(reply, getPlayerButtons(store.remainedPlayers));
      return;
    }
    if (store.remainedPlayers.length === 1)
      store.teamsData[getNextChoosingTeam()].push(store.remainedPlayers[0]);

    reply = `
✅ <b>Поділили</b>
Варіант розподілу: ${getButtonText()}
Кількість команд: ${store.teamsQuantity}
Капітанів обрано: ${store.captainsChoice} ${getLineups()}
`;

    await ctx.replyWithHTML(reply);

    await sendInfoMessageToCreator(ctx, reply);
    resetStore();
  } catch (err) {
    await handleError(err, ctx);
  }
};
