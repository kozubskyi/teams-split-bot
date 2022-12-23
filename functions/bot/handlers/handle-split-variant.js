const store = require('../store')
const { teamsQuantityButtons } = require('../helpers/buttons')
const handleError = require('./handle-error')

module.exports = async function handleSplitVariant(ctx) {
  store.splitVariant = ctx.callbackQuery.data

  try {
    await ctx.reply('Вкажіть кількість команд', teamsQuantityButtons)
  } catch (err) {
    await handleError(err, ctx)
  }
}
