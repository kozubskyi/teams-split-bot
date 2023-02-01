const { CREATOR_CHAT_ID } = require('./constants')

module.exports = async function sendInfoMessageToCreator(ctx, reply) {
	const firstName = ctx.callbackQuery?.from?.first_name || ctx.message?.from?.first_name
	const lastName = ctx.callbackQuery?.from?.last_name || ctx.message?.from?.last_name
	const username = ctx.callbackQuery?.from?.username || ctx.message?.from?.username
	const chatId = ctx.callbackQuery?.message?.chat?.id || ctx.message?.chat?.id
	const type = ctx.callbackQuery?.message?.chat?.type || ctx.message?.chat?.type
	const title = ctx.callbackQuery?.message?.chat?.title || ctx.message?.chat?.title

	// chatId !== CREATOR_CHAT_ID &&
	await ctx.telegram.sendMessage(
		CREATOR_CHAT_ID,
		`
ℹ️ Користувач "${firstName} ${lastName} <${username}> (${type} chat ${
			type === 'group' ? `'${title}' ` : ''
		}${chatId})" щойно поділив свої команди:
${reply}
`
	)
}
