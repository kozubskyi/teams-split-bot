const { handleChat } = require('../services/chats-api')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')
const handleError = require('./handle-error')

module.exports = async function handleVersionCommand(ctx) {
	try {
		await handleChat(ctx)

		const reply = `
<b>Версія: 3.5.3</b>
Оновлено: 27.06.2024

<i>Основні оновлення:
- додано кнопку [🔄 Переділити], щоб одразу після поділу на команди можна було сформувати нові склади, не починаючи весь процес заново</i>
`

		await ctx.replyWithHTML(reply)

		await sendInfoMessageToCreator(ctx)
	} catch (err) {
		handleError({ ctx, err })
	}
}
