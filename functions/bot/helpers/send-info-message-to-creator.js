const { CREATOR_CHAT_ID } = require('./constants')

module.exports = async function sendInfoMessageToCreator(ctx, reply) {
	const chatId = ctx.chat?.id
	const type = ctx.chat?.type
	const title = ctx.chat?.title
	const firstName = ctx.from?.first_name
	const lastName = ctx.from?.last_name
	const username = ctx.from?.username
	const userChatId = ctx.from?.id
	const text = ctx.message?.text

	let creatorReply = `
Chat: ${type} ${title ? `"${title}" ` : ''}${chatId}

Користувач ${firstName} ${lastName} <${username}> ${userChatId}`
	if (text && text[0] === '/') {
		creatorReply = `${creatorReply} натиснув команду ${text.slice(1, 6).toUpperCase()}`
	} else {
		creatorReply = `
${creatorReply} поділив свої команди:
${reply}`
	}

	chatId !== CREATOR_CHAT_ID && (await ctx.telegram.sendMessage(CREATOR_CHAT_ID, creatorReply))
}
