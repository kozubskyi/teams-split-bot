const { store, resetStore } = require('../store');
const { replies, buttons } = require('../helpers');
const handleError = require('./handle-error');

module.exports = async function handleStartCommand(ctx) {
  try {
    resetStore();

    // await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
    await ctx.replyWithHTML(replies.startCommandReply, buttons.splitVariantButtons);
  } catch (err) {
    await handleError(err, ctx);
  }
};
