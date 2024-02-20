const fs = require('fs')
const { handleChat } = require('../services/chats-api')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')
const handleError = require('./handle-error')

module.exports = async function handleVersionCommand(ctx) {
	try {
		await handleChat(ctx)

		fs.readFile(path.resolve(__dirname, '../../../package.json'), 'utf8', (err, data) => {
			if (err) return handleError({ ctx, err })

			const { version, lastUpdateDate } = JSON.parse(data)

			ctx.replyWithHTML(`<b>Версія: ${version}</b>\nОновлено: ${lastUpdateDate}`)
		})

		sendInfoMessageToCreator(ctx)
	} catch (err) {
		handleError({ ctx, err })
	}
}
