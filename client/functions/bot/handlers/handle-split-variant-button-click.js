const { Markup } = require('telegraf')
const { store } = require('../store')
const { buttons, getButtonText } = require('../helpers')
const handleError = require('./handle-error')

module.exports = async function handleSplitVariantButtonClick(ctx) {
	try {
		const { first_name, last_name } = ctx.callbackQuery.from
		store.splitVariant = ctx.callbackQuery.data
		store.splitVariantChooser = `${first_name}${last_name ? ` ${last_name}` : ''}`

		await ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id)
		await ctx.replyWithHTML(
			`<i>Користувач ${store.splitVariantChooser} обрав варіант розподілу: ${getButtonText()}</i>`
		)
		await ctx.reply('Оберіть кількість команд', Markup.inlineKeyboard(buttons.teamsQuantityButtons))
		Markup
	} catch (err) {
		await handleError(err, ctx)
	}
}
