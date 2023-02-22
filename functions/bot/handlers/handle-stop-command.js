const { handleChat } = require('../services/chats-api')
const { handleStore } = require('../services/stores-api')
const handleError = require('./handle-error')

module.exports = async function handleStopCommand(ctx) {
	try {
		await handleChat(ctx)
		await handleStore(ctx.chat.id)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
