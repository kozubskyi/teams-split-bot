const { store, resetStore } = require('../store')
const { replies, buttons, getButtonText } = require('../helpers')
const handleError = require('./handle-error')

module.exports = async function handleTeamsQuantityButtonClick(ctx) {
  try {
    if (!store.splitVariant) return await ctx.reply(replies.firstChooseSplitVariantReply, buttons.splitVariantButtons)

    store.teamsQuantity = Number(ctx.callbackQuery.data[0])
    store.list = 'players'

    for (let i = 1; i <= store.teamsQuantity; i++) store.teamsData[i] = []

    let reply = `
Варіант розподілу: ${getButtonText()}
Кількість команд: ${store.teamsQuantity}
${replies.sendPlayersListReply}
`

    if (store.splitVariant === 'skill_split') {
      reply = `
${reply}
${replies.youChoseSkillSplitReply}
`
    }

    await ctx.replyWithHTML(reply)
  } catch (err) {
    await handleError(err, ctx)
  }
}
