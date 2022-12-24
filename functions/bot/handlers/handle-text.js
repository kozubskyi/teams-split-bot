const { store, resetStore } = require('../store')
const helpers = require('../helpers')
const { buttons } = require('../helpers')
const splitHandlers = require('./split-handlers')
const handleError = require('./handle-error')

module.exports = async function handleText(ctx) {
  if (!store.splitVariant || !store.teamsQuantity) return

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

      splitHandlers.handleCaptainsSplit()

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

      if (store.splitVariant === 'captains_split' && store.players.length !== store.teamsQuantity) {
        const reply = `Натисність на кнопку нижче і я самостійно випадковим чином оберу капітанів зі списку гравців, або відправте список з ${store.teamsQuantity}-х капітанів.`

        await ctx.reply(reply, helpers.buttons.randomCaptainsButton)

        store.list = 'captains'
      } else {
        if (store.splitVariant === 'skill_split') splitHandlers.handleSkillSplit()
        if (store.splitVariant === 'random_split') splitHandlers.handleRandomSplit()
        if (store.splitVariant === 'captains_split' && store.players.length === store.teamsQuantity) {
          splitHandlers.handlePlayersAndTeamsSameQuantity()
        }
        if (store.splitVariant === 'captains_split' && store.players.length === store.teamsQuantity + 1) {
          splitHandlers.handlePlayersAndTeamsSameQuantity()
        }

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
