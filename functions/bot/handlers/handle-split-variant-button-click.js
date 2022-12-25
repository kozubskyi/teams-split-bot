const { store } = require('../store')
const { replies, buttons, getButtonText } = require('../helpers')
const handleError = require('./handle-error')

module.exports = async function handleSplitVariantButtonClick(ctx) {
  try {
    store.splitVariant = ctx.callbackQuery.data

    const reply = `
Варіант розподілу: ${getButtonText()}

${replies.chooseTeamsQuantityReply}
`

    await ctx.reply(reply, buttons.teamsQuantityButtons)
  } catch (err) {
    await handleError(err, ctx)
  }
}
