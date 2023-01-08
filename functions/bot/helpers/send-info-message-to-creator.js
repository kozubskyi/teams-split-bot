const { CREATOR_USERNAME, CREATOR_CHAT_ID } = require('./constants')

module.exports = async function sendInfoMessageToCreator(ctx, reply) {
	const firstName = ctx.callbackQuery?.from?.first_name || ctx.message?.from?.first_name
	const lastName = ctx.callbackQuery?.from?.last_name || ctx.message?.from?.last_name
	const username = ctx.callbackQuery?.from?.username || ctx.message?.from?.username
	const chatId = ctx.callbackQuery?.message?.chat?.id || ctx.message?.chat?.id

	username !== CREATOR_USERNAME &&
		(await ctx.telegram.sendMessage(
			CREATOR_CHAT_ID,
			`
ℹ️ Користувач "${firstName} ${lastName} <${username}> (${chatId})" щойно поділив(-ла) свої команди:
${reply}
`
		))
}
