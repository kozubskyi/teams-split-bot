const { store, resetStore } = require('../store');
const { replies, buttons, getButtonText } = require('../helpers');
const handleError = require('./handle-error');

module.exports = async function handleTeamsQuantityButtonClick(ctx) {
  try {
    if (!store.splitVariant)
      return await ctx.reply(replies.firstChooseSplitVariantReply, buttons.splitVariantButtons);

    const { first_name, last_name } = ctx.callbackQuery.from;
    store.teamsQuantity = Number(ctx.callbackQuery.data[0]);
    store.list = 'players';

    for (let i = 1; i <= store.teamsQuantity; i++) store.teamsData[i] = [];

    let reply = replies.sendPlayersListReply;

    if (store.splitVariant === 'skill_split') {
      reply = `
${reply}
${replies.youChoseSkillSplitReply}
`;
    }

    reply = `
${reply}
<i>ℹ️ ${first_name} ${last_name ? last_name : null} обрав кількість команд: ${store.teamsQuantity}</i>
`

    await ctx.replyWithHTML(reply);
  } catch (err) {
    await handleError(err, ctx);
  }
};
