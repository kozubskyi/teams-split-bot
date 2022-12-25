const { store } = require('../store')
const { replies, buttons } = require('../helpers')
const handleError = require('./handle-error')

module.exports = async function handleSplitVariantButtonClick(ctx) {
  store.splitVariant = ctx.callbackQuery.data

  try {
    await ctx.reply(replies.chooseTeamsQuantityReply, buttons.teamsQuantityButtons)
  } catch (err) {
    await handleError(err, ctx)
  }
}
