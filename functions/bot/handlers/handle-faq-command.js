const { Markup } = require('telegraf')
const { handleChat } = require('../services/chats-api')
const { handleStore } = require('../services/stores-api')
const handleError = require('./handle-error')
const { HOW_USE_BOT, HOW_RANDOM_WORKS } = require('../helpers/constants')

module.exports = async function handleFAQCommand(ctx) {
	try {
		await handleChat(ctx)
		await handleStore(ctx.chat.id)

		const buttons = Markup.inlineKeyboard([
			[Markup.button.callback(HOW_USE_BOT, HOW_USE_BOT)],
			[Markup.button.callback(HOW_RANDOM_WORKS, HOW_RANDOM_WORKS)],
		])

		await ctx.replyWithHTML('Часто задаваємі питання:', buttons)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
