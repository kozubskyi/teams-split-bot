const { Markup } = require('telegraf')
const { CREATOR_CHAT_ID } = require('../helpers/chat-ids')

module.exports = async (ctx) => {
  const firstName = ctx.callbackQuery.from.first_name
  const lastName = ctx.callbackQuery.from.last_name
  const username = ctx.callbackQuery.from.username
  const chatId = ctx.callbackQuery.message.chat.id
  const data = ctx.callbackQuery.data

  try {
    await ctx.reply(
      'Вкажіть кількість команд',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('2', '2_teams'),
          Markup.button.callback('3', '3_teams'),
          Markup.button.callback('4', '4_teams'),
        ],
      ])
    )
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
