const { store, resetStore } = require('../../store')
const helpers = require('../../helpers')
const splitHandlers = require('../split-handlers')

module.exports = async function handlePlayers(ctx) {
  if (store.players.length < store.teamsQuantity) {
    await ctx.reply(
      `Вказано гравців: ${store.players.length}, а потрібно не меньше ${store.teamsQuantity}-х, спробуйте ще. Кожний наступний гравець повинен бути вказаний з нового рядка.`
    )
    store.players = []
    return
  }
  if (store.players.length === store.teamsQuantity) {
    store.remainedPlayers = [...store.players]

    let teams = Object.keys(store.teamsData)

    for (let i = 0; i < store.teamsQuantity; i++) {
      const chosenTeam = helpers.getRandomFromArray(teams)
      const chosenPlayer = helpers.getRandomFromArray(store.remainedPlayers)
      const player = store.splitVariant === 'captains_split' ? `${chosenPlayer} (C)` : chosenPlayer

      store.teamsData[chosenTeam].push(player)

      teams = teams.filter((team) => team !== chosenTeam)
      store.remainedPlayers = store.remainedPlayers.filter((player) => player !== chosenPlayer)
    }

    // if (store.players.length === store.teamsQuantity + 1) store.teamsData['1'].push(store.remainedPlayers[0])

    const reply = `
✅ <b>Поділив</b>
Варіант розподілу: ${helpers.getButtonText()}
Кількість команд: ${store.teamsQuantity} ${helpers.getLineups()}
`
    await ctx.replyWithHTML(reply)

    await helpers.sendInfoMessageToCreator(ctx, reply)
    resetStore()
    return
  }

  if (store.splitVariant === 'captains_split') {
    await ctx.reply(
      `Натисність на кнопку нижче і я самостійно випадковим чином оберу капітанів зі списку гравців, або відправте список з ${store.teamsQuantity}-х капітанів.`,
      helpers.buttons.randomCaptainsButton
    )

    store.list = 'captains'
    return
  }

  if (store.splitVariant === 'skill_split') splitHandlers.handleSkillSplit()
  if (store.splitVariant === 'random_split') splitHandlers.handleRandomSplit()

  const reply = `
✅ <b>Поділив</b>
Варіант розподілу: ${helpers.getButtonText()}
Кількість команд: ${store.teamsQuantity} ${helpers.getLineups()}
`
  await ctx.replyWithHTML(reply)

  await helpers.sendInfoMessageToCreator(ctx, reply)
  resetStore()
}
