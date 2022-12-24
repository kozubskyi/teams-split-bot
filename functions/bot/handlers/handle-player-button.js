const { store, resetStore } = require('../store')
const { buttons, getNextChoosingTeam, getButtonText, getLineups, getPlayerButtons } = require('../helpers')
const handleError = require('./handle-error')

module.exports = async function handlePlayerButton(ctx) {
  const clickedPlayer = ctx.callbackQuery.data
  if (clickedPlayer === '-' || !store.remainedPlayers.includes(clickedPlayer)) return

  try {
    if (!store.splitVariant) return await ctx.reply('Спочатку оберіть варіант розподілу', buttons.splitVariantButtons)
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
    if (!store.captains.length) {
      const reply = `
Відправте список з ${store.teamsQuantity}-х капітанів, або натисність на кнопку нижче і я самостійно випадковим чином оберу капітанів зі списку гравців.
`
      await ctx.reply(reply, buttons.randomCaptainsButton)

      store.list = 'captains'
    }

    store.currentTeam = store.currentTeam === store.teamsQuantity ? 1 : store.currentTeam + 1

    store.teamsData[store.currentTeam].push(clickedPlayer)

    store.remainedPlayers = store.remainedPlayers.filter((player) => player !== clickedPlayer)

    const currentPickCaptain = store.teamsData[getNextChoosingTeam()][0].slice(0, -4)

    let reply = ''

    if (store.remainedPlayers.length > 1) {
      reply = `Зараз обирає: <b>${currentPickCaptain}</b> ${getLineups()} <i>❗Інші користувачі чату не натискайте на кнопки гравців, тому що бот сприйме це як вибір капітана.</i>`

      await ctx.replyWithHTML(reply, getPlayerButtons(store.remainedPlayers))
    } else {
      store.teamsData[getNextChoosingTeam()].push(store.remainedPlayers[0])

      reply = `
✅ <b>Поділили</b>
Варіант розподілу: ${getButtonText()}
Кількість команд: ${store.teamsQuantity}
Капітанів обрано: ${store.captainsChoice} ${getLineups()}
`

      await ctx.replyWithHTML(reply)

      resetStore()
    }
  } catch (err) {
    await handleError(err, ctx)
  }
}
