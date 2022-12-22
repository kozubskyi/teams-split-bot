const { CREATOR_CHAT_ID } = require('../helpers/chat-ids')

module.exports = async (ctx, splitVersion) => {
  const firstName = ctx.callbackQuery.from.first_name
  const lastName = ctx.callbackQuery.from.last_name
  const username = ctx.callbackQuery.from.username
  const chatId = ctx.callbackQuery.message.chat.id
  const data = ctx.callbackQuery.data

  try {
    if (splitVersion === 'skill_split') {
      await ctx.replyWithHTML(`
Відправте список гравців у форматі:

Прізвище
Прізвище
Прізвище
...

<i>❗Ви обрали розподіл "За скілом", тому обов'язково потрібно відправити список гравців, сформований від найкращого до найгіршого гравця (на вашу суб'єктивну думку).</i>
`)
    } else if (splitVersion === 'random_split') {
      await ctx.reply(`
Відправте список гравців у форматі:

Прізвище
Прізвище
Прізвище
...
`)
    } else {
      await ctx.reply('Не вказано вид розподілу. Для початку введіть команду /start')
    }
  } catch (err) {
    chatId !== CREATOR_CHAT_ID && (await ctx.reply('Виникли технічні неполадки, скоро полагоджусь і повернусь 👨‍🔧'))

    await ctx.telegram.sendMessage(
      CREATOR_CHAT_ID,
      `❌ Помилка! Користувач "${firstName} ${lastName} <${username}> (${chatId})" натиснув(-ла) кнопку "${data}" і виникла помилка "${
        err?.response?.data?.message ?? err
      }"`
    )
  }
}
