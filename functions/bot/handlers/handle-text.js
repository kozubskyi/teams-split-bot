const store = require('../store')
const { buttons, getButtonText, getLineups, sendInfoMessageToCreator } = require('../helpers')
const { handleSkillSplit, handleRandomSplit } = require('./split-handlers')
const handleError = require('./handle-error')

module.exports = async function handleText(ctx) {
  if (!store.splitVariant || !store.teamsQuantity) return

  store[store.nextList] = ctx.message.text.split('\n')
  if (store.players.length <= 1) {
    return await ctx.reply(
      'Ви вказали меньше 2-х гравців. Спробуйте ще, кожний наступний гравець повинен бути вказаний з нового рядка.'
    )
  }
  for (let i = 1; i <= store.teamsQuantity; i++) store.teamsData[i] = []

  try {
    if (store.splitVariant === 'captains_split') {
      const captainsExample = []
      for (let i = 0; i < store.teamsQuantity; i++) captainsExample.push('Прізвище')

      const reply = `
Відправте список з ${store.teamsQuantity}-х капітанів у форматі:

${captainsExample.join('\n')}

Або натисність на кнопку нижче і я самостійно випадковим чином оберу капітанів зі списку гравців.
`
      store.nextList = 'captains'

      await ctx.reply(reply, buttons.randomCaptainsButton)
    } else {
      if (store.splitVariant === 'skill_split') handleSkillSplit()
      if (store.splitVariant === 'random_split') handleRandomSplit()

      const reply = `
✅ <b>Поділив</b>
Варіант розподілу: ${getButtonText(store.splitVariant)}
Кількість команд: ${store.teamsQuantity} ${getLineups(store.teamsData)}
`

      await ctx.replyWithHTML(reply)

      await sendInfoMessageToCreator(ctx, reply)

      store.splitVariant = ''
      store.teamsQuantity = 0
      store.players = []
      store.captains = []
      store.nextList = 'players'
      store.teamsData = {}
    }
  } catch (err) {
    await handleError(err, ctx)
  }
}
