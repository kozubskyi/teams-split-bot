const { Markup } = require('telegraf')
const handleError = require('./handle-error')
const { HOW_USE_BOT, HOW_RANDOM_WORKS, HOW_SKILL_SPLIT_WORKS } = require('../helpers/constants')

module.exports = async function handleFAQCommand(ctx) {
	const buttons = Markup.inlineKeyboard([
		[Markup.button.callback(HOW_USE_BOT, HOW_USE_BOT)],
		[Markup.button.callback(HOW_RANDOM_WORKS, HOW_RANDOM_WORKS)],
		[Markup.button.callback(HOW_SKILL_SPLIT_WORKS, HOW_SKILL_SPLIT_WORKS)],
	])

	await ctx.reply('Часті запитання:', buttons)
}
