const { store, resetStore } = require('../store')
const { buttons, getRandomFromArray, getLineups, getPlayerButtons } = require('../helpers')
const handleError = require('./handle-error')

module.exports = async function handleRandomCaptainsButtonClick(ctx) {
  try {
    if (!store.splitVariant) {
      resetStore()
      return await ctx.reply('Спочатку оберіть варіант розподілу', buttons.splitVariantButtons)
    }
    if (!store.teamsQuantity) return await ctx.reply('Спочатку вкажіть кількість команд', buttons.teamsQuantityButtons)
    if (!store.players.length) {
      let reply = `
Відправте список гравців у форматі:

Прізвище
Прізвище
Прізвище
...
`
      return await ctx.replyWithHTML(reply)
    }
    if (store.captains.length) return await ctx.reply('Капітанів уже обрано')

    store.captainsChoice = 'Рандомно'

    store.remainedPlayers = [...store.players]
    let teams = Object.keys(store.teamsData)

    for (let i = 1; i <= store.teamsQuantity; i++) {
      const chosenPlayer = getRandomFromArray(store.remainedPlayers)
      const chosenTeam = getRandomFromArray(teams)

      store.captains.push(chosenPlayer)
      store.teamsData[chosenTeam].push(`${chosenPlayer} (C)`)

      store.remainedPlayers = store.remainedPlayers.filter((player) => player !== chosenPlayer)
      teams = teams.filter((team) => team !== chosenTeam)
    }

    const firstPickCaptain = store.teamsData['1'][0].slice(0, -4)

    const reply = `Першим обирає: <b>${firstPickCaptain}</b> ${getLineups()} <i>❗Інші користувачі чату не натискайте на кнопки гравців, тому що бот сприйме це як вибір капітана.</i>`

    await ctx.replyWithHTML(reply, getPlayerButtons(store.remainedPlayers))

    store.list = ''
  } catch (err) {
    await handleError(err, ctx)
  }
}
