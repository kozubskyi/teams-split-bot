const { teamsQuantityButtons } = require('../helpers/buttons')
const handleError = require('./handle-error')

module.exports = async function handleSplitVariantClick(ctx) {
  try {
    await ctx.reply('Вкажіть кількість команд', teamsQuantityButtons)
  } catch (err) {
    await handleError(err, ctx)
  }
}
