const { buttons, getButtonText, getLineups, sendInfoMessageToCreator } = require('../helpers')
const handleError = require('./handle-error')
const splitHandlers = require('./split-handlers')

module.exports = async function handlePlayersList(ctx, { splitVariant, teamsQuantity, players, teamsData }) {
  if (!splitVariant || !teamsQuantity) {
    // await ctx.reply('Для початку введіть команду /start')
    await ctx.reply('ALARM - TREBA /start')
    return
  }

  players = ctx.message.text.split('\n')
  for (let i = 1; i <= teamsQuantity; i++) teamsData[i] = []

  try {
    if (splitVariant === 'captains_split') {
      await ctx.reply('Як обрати капітанів?', buttons.captaintsSelectionVariantButtons)

      return { splitVariant, teamsQuantity, players, teamsData }
    } else {
      if (splitVariant === 'skill_split') {
        teamsData = splitHandlers.handleSkillSplit(players, teamsData)
      }
      if (splitVariant === 'random_split') {
        teamsData = splitHandlers.handleRandomSplit(players, teamsData)
      }

      const reply = `
✅ <b>Поділив</b>
Варіант розподілу: ${getButtonText(splitVariant)}
Кількість команд: ${teamsQuantity} ${getLineups(teamsData)}
`

      await ctx.replyWithHTML(reply)

      await sendInfoMessageToCreator(ctx, reply)

      splitVariant = ''
      teamsQuantity = 0
      players = []
      teamsData = {}

      return { splitVariant, teamsQuantity, players, teamsData }
    }
  } catch (err) {
    await handleError(err, ctx)
  }
}
