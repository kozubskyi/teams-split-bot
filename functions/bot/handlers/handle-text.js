const { store, resetStore } = require('../store')
const helpers = require('../helpers')
const { buttons } = require('../helpers')
const { handleSkillSplit, handleRandomSplit } = require('./split-handlers')
const handleError = require('./handle-error')

module.exports = async function handleText(ctx) {
  if (!store.splitVariant || !store.teamsQuantity) {
    resetStore()
    return
  }

  store[store.list] = ctx.message.text.split('\n')

  try {
    if (store.list === 'captains') {
      store.captainsChoice = 'Вказано'

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

      store.captains.forEach((player) => {
        const chosenTeam = helpers.getRandomFromArray(teams)

        store.teamsData[chosenTeam].push(`${player} (C)`)

        teams = teams.filter((team) => team !== chosenTeam)
      })

      const firstPickCaptain = store.teamsData['1'][0].slice(0, -4)

      const reply = `Першим обирає: <b>${firstPickCaptain}</b> ${helpers.getLineups()} <i>❗Інші користувачі чату не натискайте на кнопки гравців, тому що бот сприйме це як вибір капітана.</i>`

      await ctx.replyWithHTML(reply, helpers.getPlayerButtons(store.remainedPlayers))

      store.list = ''
    }
    if (store.list === 'players') {
      if (store.players.length < store.teamsQuantity) {
        return await ctx.reply(
          `Ви вказали меньше ${store.teamsQuantity}-х гравців, спробуйте ще. Кожний наступний гравець повинен бути вказаний з нового рядка.`
        )
      }

      for (let i = 1; i <= store.teamsQuantity; i++) store.teamsData[i] = []

      if (store.splitVariant === 'captains_split') {
        const reply = `Натисність на кнопку нижче і я самостійно випадковим чином оберу капітанів зі списку гравців, або відправте список з ${store.teamsQuantity}-х капітанів.`

        await ctx.reply(reply, helpers.buttons.randomCaptainsButton)

        store.list = 'captains'
      } else {
        if (store.splitVariant === 'skill_split') handleSkillSplit()
        if (store.splitVariant === 'random_split') handleRandomSplit()

        const reply = `
✅ <b>Поділив</b>
Варіант розподілу: ${helpers.getButtonText()}
Кількість команд: ${store.teamsQuantity} ${helpers.getLineups()}
`

        await ctx.replyWithHTML(reply)

        await helpers.sendInfoMessageToCreator(ctx, reply)

        resetStore()
      }
    }
  } catch (err) {
    await handleError(err, ctx)
  }
}
