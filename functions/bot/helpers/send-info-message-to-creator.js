const { CREATOR_CHAT_ID } = require('./constants')

module.exports = async function sendInfoMessageToCreator(ctx, reply) {
	const firstName = ctx.callbackQuery?.from?.first_name || ctx.message?.from?.first_name
	const lastName = ctx.callbackQuery?.from?.last_name || ctx.message?.from?.last_name
	const username = ctx.callbackQuery?.from?.username || ctx.message?.from?.username
	const userChatId = ctx.callbackQuery?.from?.id || ctx.message?.from?.id
	const chatId = ctx.callbackQuery?.message?.chat?.id || ctx.message?.chat?.id
	const type = ctx.callbackQuery?.message?.chat?.type || ctx.message?.chat?.type
	const title = ctx.callbackQuery?.message?.chat?.title || ctx.message?.chat?.title
	// const buttonValue = ctx.callbackQuery?.data
	const text = ctx.message.text

	let creatorReply = `
Chat: ${type} ${title ? `"${title}" ` : ''}${chatId}

Користувач ${firstName} ${lastName} <${username}> ${userChatId} щойно`

	if (text.slice(0, 6) === '/start') {
		creatorReply = `${creatorReply} натиснув команду Start.`
	} else {
		creatorReply = `
${creatorReply} поділив свої команди:
${reply}`
	}

	chatId !== CREATOR_CHAT_ID && (await ctx.telegram.sendMessage(CREATOR_CHAT_ID, creatorReply))
}
