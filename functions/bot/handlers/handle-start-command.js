const { Markup } = require('telegraf')
const { CREATOR_USERNAME, CREATOR_CHAT_ID } = require('../helpers/constants')

module.exports = async (ctx) => {
  const firstName = ctx.message.from.first_name
  const lastName = ctx.message.from.last_name
  const username = ctx.message.from.username
  const chatId = ctx.message.chat.id
  const text = ctx.message.text

  const reply = `
Я бот, що був створений для поділу гравців на команди у командних видах спорту. Вкажіть як ви хочете, щоб відбувся розподіл:

<b>За скілом</b> - гравці будуть поділені на команди, враховуючи індивідуальні навички кожного гравця. Для цього пізніше потрібно буде відправити список гравців, сформований від найкращого до найгіршого гравця (на вашу суб'єктивну думку).

<b>Рандомно</b> - гравці будуть поділені на команди випадковим чином, не зважаючи на індивідуальні навички кожного гравця.
`
  const buttons = Markup.inlineKeyboard([
    [Markup.button.callback('💪 За скілом', 'skill_split'), Markup.button.callback('🎲 Рандомно', 'random_split')],
  ])

  try {
    await ctx.replyWithHTML(reply, buttons)
  } catch (err) {
    username !== CREATOR_USERNAME && (await ctx.reply('Виникли технічні неполадки, скоро полагоджусь і повернусь 👨‍🔧'))

    await ctx.telegram.sendMessage(
      CREATOR_CHAT_ID,
      `❌ Помилка! Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${text}" і виникла помилка "${
        err?.response?.data?.message ?? err
      }"`
    )
  }
}
