const { store, resetStore } = require('../store')
const { splitVariantButtons } = require('../helpers/buttons')
const handleError = require('./handle-error')

module.exports = async function handleTeamsQuantityButtonClick(ctx) {
  if (!store.splitVariant) {
    resetStore()
    await ctx.reply('Спочатку оберіть варіант розподілу', splitVariantButtons)
    return
  }

  store.teamsQuantity = Number(ctx.callbackQuery.data[0])
  store.list = 'players'

  for (let i = 1; i <= store.teamsQuantity; i++) store.teamsData[i] = []

  let reply = `
Відправте список гравців у форматі:

Прізвище
Прізвище
Прізвище
...
`
  if (store.splitVariant === 'skill_split') {
    reply = `
${reply}
<i>❗Ви обрали розподіл "За скілом", тому обов'язково потрібно відправити список гравців, сформований від найкращого до найгіршого гравця (на вашу суб'єктивну думку).</i>
`
  }

  try {
    await ctx.replyWithHTML(reply)
  } catch (err) {
    await handleError(err, ctx)
  }
}
