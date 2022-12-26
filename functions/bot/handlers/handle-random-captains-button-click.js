const { store } = require('../store')
const { replies, getRandomFromArray, getLineups, getPlayerButtons, sendFinalReply } = require('../helpers')
const { splitVariantButtons, teamsQuantityButtons } = require('../helpers/buttons')
const handleError = require('./handle-error')

module.exports = async function handleRandomCaptainsButtonClick(ctx) {
  try {
    if (!store.splitVariant) return await ctx.reply(replies.firstChooseSplitVariantReply, splitVariantButtons)
    if (!store.teamsQuantity) return await ctx.reply(replies.fitstChooseTeamsQuantityReply, teamsQuantityButtons)
    if (!store.players.length) return await ctx.replyWithHTML(replies.sendPlayersListReply)
    if (store.captains.length) return await ctx.reply(replies.captainsAreSpecified)

    store.remainedPlayers = [...store.players]
    let teams = Object.keys(store.teamsData)

    for (let i = 1; i <= store.teamsQuantity; i++) {
      const chosenPlayer = getRandomFromArray(store.remainedPlayers)
      const chosenTeam = getRandomFromArray(teams)

      store.captains.push(chosenPlayer)
      store.teamsData[chosenTeam].push(`${chosenPlayer} (C)`)

      store.remainedPlayers.splice(store.remainedPlayers.indexOf(chosenPlayer), 1)
      teams = teams.filter((team) => team !== chosenTeam)
    }

    if (store.remainedPlayers.length === 1) {
      store.teamsData['1'].push(store.remainedPlayers[0])

      await sendFinalReply(ctx)
      return
    }

    const { first_name, last_name, username } = ctx.callbackQuery.from
    const firstPickCaptain = store.teamsData['1'][0].slice(0, -4)
    const reply = `
<i>ℹ️ ${first_name} ${last_name ? last_name : username} вирішив обрати капітанів рандомно</i>

Першим гравця обирає: <b>${firstPickCaptain}</b> ${getLineups()} ${replies.dontTouchPlayerButtons}
`

    await ctx.replyWithHTML(reply, getPlayerButtons(store.remainedPlayers))

    store.captainsChoice = 'Рандомно'
    store.list = ''
  } catch (err) {
    await handleError(err, ctx)
  }
}
