const { store, resetStore } = require('../store')
const { replies, buttons, getButtonText } = require('../helpers')
const handleError = require('./handle-error')

module.exports = async function handleTeamsQuantityButtonClick(ctx) {
  try {
    if (!store.splitVariant) return
    // if (!store.splitVariant) return await ctx.reply(replies.firstChooseSplitVariantReply, buttons.splitVariantButtons)

    const { first_name, last_name, username } = ctx.callbackQuery.from
    store.teamsQuantity = Number(ctx.callbackQuery.data[0])
    store.list = 'players'

    for (let i = 1; i <= store.teamsQuantity; i++) store.teamsData[i] = []

    let reply = `
<i>ℹ️ ${first_name} ${last_name ? last_name : username} обрав кількість команд: ${store.teamsQuantity}</i>
${replies.sendPlayersListReply}
`
    if (store.splitVariant === 'skill_split') {
      reply = `${reply}${replies.youChoseSkillSplitReply}`
    }

    await ctx.replyWithHTML(reply)
  } catch (err) {
    await handleError(err, ctx)
  }
}
