const store = require('./store')
const handlers = require('./handlers')

module.exports = async function handleButton(ctx) {
  const buttonValue = ctx.callbackQuery.data

  try {
    await ctx.reply('Вкажіть кількість команд', teamsQuantityButtons)
  } catch (err) {
    await handlers.handleError(err, ctx)
  }

  await handlers.handleSplitVariantClick(ctx)
}
