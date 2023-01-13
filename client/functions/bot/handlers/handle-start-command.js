const { Markup } = require('telegraf')
const { resetStore } = require('../store')
const { buttons } = require('../helpers')
const handleError = require('./handle-error')

module.exports = async function handleStartCommand(ctx) {
	try {
		resetStore()

		const reply = `
Я бот, що був створений для розподілу гравців на команди у футболі та інших командних іграх. Для початку оберіть варіант розподілу:

<b>Капітанами</b> - кожен з капітанів буде по черзі набирати собі гравців у команду.

<b>За скілом</b> - гравці будуть поділені на команди, враховуючи індивідуальні навички кожного гравця.

<b>Рандомно</b> - гравці будуть поділені на команди випадковим чином.
`

		await ctx.replyWithHTML(reply, Markup.inlineKeyboard(buttons.splitVariantButtons))
		Markup
	} catch (err) {
		await handleError(err, ctx)
	}
}
