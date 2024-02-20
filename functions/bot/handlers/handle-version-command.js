const { handleChat } = require('../services/chats-api')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')
const handleError = require('./handle-error')

module.exports = function handleVersionCommand(ctx) {
	try {
		handleChat(ctx)

		ctx.replyWithHTML('<b>Версія: 3.4.3</b>\nОновлено: 20.02.2024')

		sendInfoMessageToCreator(ctx)
	} catch (err) {
		handleError({ ctx, err })
	}
}
