require('dotenv').config()
const { Telegraf } = require('telegraf')
const handlers = require('./handlers')
const constants = require('./helpers/constants')

const bot = new Telegraf(process.env.BOT_TOKEN)

function start() {
	bot.start(async ctx => await handlers.handleStartCommand(ctx))
	bot.command('stop', async ctx => handlers.handleStopCommand(ctx))

	bot.action(constants.CAPTAINS_SPLIT, async ctx => await handlers.handleSplitVariantButtonClick(ctx))
	bot.action(constants.SKILL_SPLIT, async ctx => await handlers.handleSplitVariantButtonClick(ctx))
	bot.action(constants.RANDOM_SPLIT, async ctx => await handlers.handleSplitVariantButtonClick(ctx))

	bot.action('2', async ctx => await handlers.handleTeamsQuantityButtonClick(ctx))
	bot.action('3', async ctx => await handlers.handleTeamsQuantityButtonClick(ctx))
	bot.action('4', async ctx => await handlers.handleTeamsQuantityButtonClick(ctx))

	bot.on('text', async ctx => await handlers.handleText(ctx))

	bot.action(constants.RANDOM_CAPTAINS, async ctx => await handlers.handleRandomCaptainsButtonClick(ctx))

	bot.action(constants.CANCEL_LAST_CHOICE, async ctx => await handlers.handleCancelLastChoiceButtonClick(ctx))
	bot.action(constants.CHANGE_SEQUENCE, async ctx => await handlers.handleChangeSequenceButtonClick(ctx))
	bot.action(constants.CHANGE_CAPTAINS, async ctx => await handlers.handleChangeCaptainsButtonClick(ctx))

	bot.on('callback_query', async ctx => await handlers.handlePlayerButtonClick(ctx))

	// bot.on('sticker', async ctx => await ctx.reply('👍'))

	console.log('✅ The bot is configured and must work correctly')
}

start()

// bot.launch()

// Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async event => {
	try {
		await bot.handleUpdate(JSON.parse(event.body))
		return { statusCode: 200, body: '' }
	} catch (e) {
		console.error('error in handler:', e)
		return { statusCode: 400, body: 'This endpoint is meant for bot and telegram communication' }
	}
}
