const { store } = require('../store');
const { replies, buttons, getButtonText } = require('../helpers');
const handleError = require('./handle-error');

module.exports = async function handleSplitVariantButtonClick(ctx) {
  try {
    const { first_name, last_name } = ctx.callbackQuery.from;
    store.splitVariant = ctx.callbackQuery.data;

    const reply = `
${replies.chooseTeamsQuantityReply}
<i>ℹ️ ${first_name} ${last_name ? last_name : null} обрав варіант розподілу: ${getButtonText()}</i>
`;

    await ctx.replyWithHTML(reply, buttons.teamsQuantityButtons);
  } catch (err) {
    await handleError(err, ctx);
  }
};
