const { store } = require('../../store')
const helpers = require('../../helpers')

module.exports = async function handleCaptains(ctx) {
  if (store.captains.length !== store.teamsQuantity) {
    await ctx.reply(
      `Потрібно вказати ${store.teamsQuantity}-х капітанів, а вказано ${store.captains.length}, спробуйте ще. Кожний наступний капітан повинен бути вказаний з нового рядка.`
    )
    store.captains = []
    return
  }
  for (let i = 0; i < store.captains.length; i++) {
    if (!store.players.includes(store.captains[i])) {
      await ctx.reply(
        `Капітана "${store.captains[i]}" немає у списку гравців, спробуйте ще. Кожний наступний капітан повинен бути вказаний з нового рядка.`
      )
      store.captains = []
      return
    }
  }

  store.remainedPlayers = store.players.filter((player) => !store.captains.includes(player))
  let teams = Object.keys(store.teamsData)

  for (let i = 0; i < store.teamsQuantity; i++) {
    const chosenTeam = helpers.getRandomFromArray(teams)
    const chosenPlayer = helpers.getRandomFromArray(store.captains)

    store.teamsData[chosenTeam].push(`${chosenPlayer} (C)`)

    teams = teams.filter((team) => team !== chosenTeam)
    store.captains = store.captains.filter((captain) => captain !== chosenPlayer)
  }

  const firstPickCaptain = store.teamsData['1'][0].slice(0, -4)
  const reply = `Першим обирає: <b>${firstPickCaptain}</b> ${helpers.getLineups()} <i>❗Інші користувачі чату не натискайте на кнопки гравців, тому що бот сприйме це як вибір капітана.</i>`

  await ctx.replyWithHTML(reply, helpers.getPlayerButtons(store.remainedPlayers))

  store.captainsChoice = 'Вказано'
  store.list = ''
}
