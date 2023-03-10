const { Markup } = require('telegraf')
const { updateStore } = require('../services/stores-api')
const deleteMessage = require('../helpers/delete-message')
const handleError = require('./handle-error')

module.exports = async function handleSplitVariantButtonClick(ctx) {
	try {
		await deleteMessage(ctx)

		const splitVariant = ctx.callbackQuery.data
		await updateStore(ctx.chat.id, { splitVariant })

		const { first_name, last_name } = ctx.from

		const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} обрав варіант розподілу: ${splitVariant}</i>
		
Оберіть кількість команд`

		const buttons = Markup.inlineKeyboard([
			[Markup.button.callback('2', '2'), Markup.button.callback('3', '3'), Markup.button.callback('4', '4')],
		])

		await ctx.replyWithHTML(reply, buttons)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
