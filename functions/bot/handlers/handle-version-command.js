const { handleChat } = require('../services/chats-api')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')
const handleError = require('./handle-error')

module.exports = async function handleVersionCommand(ctx) {
	try {
		await handleChat(ctx)

		await ctx.replyWithHTML('<b>Версія: 3.4.3</b>\nОновлено: 20.02.2024')

		await sendInfoMessageToCreator(ctx)
	} catch (err) {
		handleError({ ctx, err })
	}
}
