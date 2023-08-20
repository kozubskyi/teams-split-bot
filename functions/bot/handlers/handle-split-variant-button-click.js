const { Markup } = require('telegraf')
const deleteMessage = require('../helpers/delete-message')
const { handleChat } = require('../services/chats-api')
const { updateStore } = require('../services/stores-api')
const { TWO_TEAMS, THREE_TEAMS, FOUR_TEAMS } = require('../helpers/constants')
const handleError = require('./handle-error')

module.exports = async function handleSplitVariantButtonClick(ctx) {
	try {
		await deleteMessage(ctx)
		await handleChat(ctx)
		const splitVariant = ctx.callbackQuery.data
		await updateStore(ctx, { splitVariant })

		const { first_name, last_name } = ctx.from

		const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} обрав варіант розподілу: ${splitVariant}</i>
		
Оберіть кількість команд`

		const buttons = Markup.inlineKeyboard([
			[
				Markup.button.callback('2', TWO_TEAMS),
				Markup.button.callback('3', THREE_TEAMS),
				Markup.button.callback('4', FOUR_TEAMS),
			],
		])

		await ctx.replyWithHTML(reply, buttons)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
