const { handleChat } = require('../services/chats-api')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')
const handleError = require('./handle-error')

module.exports = async function handleVersionCommand(ctx) {
	try {
		await handleChat(ctx)

		const reply = `
<b>Версія: 3.6.0</b>
Оновлено: 28.06.2024

<i>Основні оновлення:
- додано кнопку "Переділити", щоб одразу після поділу на команди можна було сформувати нові склади, не починаючи весь процес заново;
- додано можливість обирати 1 команду, щоб сформувати список з випадковим розташуванням кожного гравця.</i>
`

		await ctx.replyWithHTML(reply)

		await sendInfoMessageToCreator(ctx)
	} catch (err) {
		handleError({ ctx, err })
	}
}
