const { PRIVATE_CHAT, GROUP_CHAT, SUPERGROUP_CHAT } = require('./constants')

module.exports = function getFields(ctx) {
	const chatId = ctx.chat?.id
	const type = ctx.chat?.type
	// const userChatId = ctx.from?.id
	const first_name = ctx.from?.first_name
	const last_name = ctx.from?.last_name
	const username = ctx.from?.username
	const title = ctx.chat?.title

	let fields = {}

	if (type === PRIVATE_CHAT) {
		fields = { first_name, last_name, username }
	}
	if (type === GROUP_CHAT || type === SUPERGROUP_CHAT) {
		fields = { title }
	}

	return { chatId, type, ...fields }
}
