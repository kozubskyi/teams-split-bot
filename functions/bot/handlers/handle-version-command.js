const fs = require('fs')
const path = require('path')
const { handleChat } = require('../services/chats-api')
const handleError = require('./handle-error')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')

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
