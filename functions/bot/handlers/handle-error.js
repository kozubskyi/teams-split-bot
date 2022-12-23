const store = require('../store')
const { CREATOR_USERNAME, CREATOR_CHAT_ID } = require('../helpers/constants')

module.exports = async function handleError(err, ctx) {
  const firstName = ctx.callbackQuery?.from?.first_name || ctx.message?.from?.first_name
  const lastName = ctx.callbackQuery?.from?.last_name || ctx.message?.from?.last_name
  const username = ctx.callbackQuery?.from?.username || ctx.message?.from?.username
  const chatId = ctx.callbackQuery?.message?.chat?.id || ctx.message?.chat?.id
  const value = ctx.callbackQuery?.data || ctx.message?.text

  console.log({ err })

  username !== CREATOR_USERNAME && (await ctx.reply('Виникли технічні неполадки, скоро полагоджусь і повернусь 👨‍🔧'))

  await ctx.telegram.sendMessage(
    CREATOR_CHAT_ID,
    `❌ Помилка! Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${value}" і виникла помилка "${
      err?.response?.data?.message ?? err
    }"`
  )

  store.splitVariant = ''
  store.teamsQuantity = 0
  store.players = []
  store.captains = []
  store.nextList = 'players'
  store.teamsData = {}
}
