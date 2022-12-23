const { splitVariantButtons } = require('../helpers/buttons')
const handleError = require('./handle-error')

module.exports = async function handleTeamsQuantityClick(ctx, splitVariant) {
  if (!splitVariant) {
    await ctx.reply('Спочатку оберіть варіант розподілу', splitVariantButtons)
    return
  }

  let reply = `
Відправте список гравців у форматі:

Прізвище
Прізвище
Прізвище
...
`
  if (splitVariant === 'skill_split') {
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
