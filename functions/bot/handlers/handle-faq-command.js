const { Markup } = require('telegraf')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')
const handleError = require('./handle-error')
const { HOW_USE_BOT, HOW_RANDOM_WORKS } = require('../helpers/constants')

module.exports = async function handleFAQCommand(ctx) {
	const buttons = Markup.inlineKeyboard([
		[Markup.button.callback(HOW_USE_BOT, HOW_USE_BOT)],
		[Markup.button.callback(HOW_RANDOM_WORKS, HOW_RANDOM_WORKS)],
	])

	await ctx.reply('Часто задаваємі питання:', buttons)

	await sendInfoMessageToCreator(ctx)
}
