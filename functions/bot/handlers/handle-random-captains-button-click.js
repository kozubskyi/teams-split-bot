const { store } = require('../store');
const {
  replies,
  getRandomFromArray,
  getLineups,
  getPlayerButtons,
  sendFinalReply,
} = require('../helpers');
const { splitVariantButtons, teamsQuantityButtons } = require('../helpers/buttons');
const handleError = require('./handle-error');

module.exports = async function handleRandomCaptainsButtonClick(ctx) {
  try {
    if (
      !store.splitVariant ||
      !store.teamsQuantity ||
      !store.players.length ||
      store.captains.length
    )
      return;
    // if (!store.splitVariant) return await ctx.reply(replies.firstChooseSplitVariantReply, splitVariantButtons)
    // if (!store.teamsQuantity) return await ctx.reply(replies.fitstChooseTeamsQuantityReply, teamsQuantityButtons)
    // if (!store.players.length) return await ctx.replyWithHTML(replies.sendPlayersListReply)
    // if (store.captains.length) return

    store.remainedPlayers = [...store.players];
    let teams = Object.keys(store.teamsData);

    for (let i = 1; i <= store.teamsQuantity; i++) {
      const chosenPlayer = getRandomFromArray(store.remainedPlayers);
      const chosenTeam = getRandomFromArray(teams);

      store.captains.push(chosenPlayer);
      store.teamsData[chosenTeam].push(`1. ${chosenPlayer} (C)`);

      store.remainedPlayers.splice(store.remainedPlayers.indexOf(chosenPlayer), 1);
      teams = teams.filter(team => team !== chosenTeam);
    }

    if (store.remainedPlayers.length === 1) {
      store.teamsData[store.currentTeam].push(`2. ${store.remainedPlayers[0]}`);

      await sendFinalReply(ctx);
      return;
    }

    const { first_name, last_name } = ctx.callbackQuery.from;
    const firstPickCaptain = store.teamsData[store.currentTeam][0].slice(3, -4);
    const reply = `
<i>ℹ️ ${first_name}${last_name ? ` ${last_name}` : ''} вирішив обрати капітанів рандомно</i>

Першим обирає: <b>${firstPickCaptain}</b> ${getLineups()} ${replies.dontTouchPlayerButtons}
`;

    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id);
    await ctx.replyWithHTML(reply, getPlayerButtons(store.remainedPlayers));

    store.captainsChoice = 'Рандомно';
    store.list = '';
  } catch (err) {
    await handleError(err, ctx);
  }
};
