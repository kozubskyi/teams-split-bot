require('dotenv').config()
const { text } = require('stream/consumers')
const { Telegraf } = require('telegraf')
const handlers = require('./handlers')
const textHandlers = require('./handlers/text-handlers')
const { resetStore } = require('./store')

const bot = new Telegraf(process.env.BOT_TOKEN)

function start() {
	// Development handlers
	// bot.on('text', async ctx => await ctx.reply('⚙️ Бот на реконструкції, скоро повернусь'));
	// bot.on('callback_query', async ctx => await ctx.reply('⚙️ Бот на реконструкції, скоро повернусь'));

	bot.start(async ctx => await handlers.handleStartCommand(ctx))
	bot.command('stop', ctx => resetStore())

	bot.action('skill_split', async ctx => await handlers.handleSplitVariantButtonClick(ctx))
	bot.action('random_split', async ctx => await handlers.handleSplitVariantButtonClick(ctx))
	bot.action('captains_split', async ctx => await handlers.handleSplitVariantButtonClick(ctx))

	bot.action('2_teams', async ctx => await handlers.handleTeamsQuantityButtonClick(ctx))
	bot.action('3_teams', async ctx => await handlers.handleTeamsQuantityButtonClick(ctx))
	bot.action('4_teams', async ctx => await handlers.handleTeamsQuantityButtonClick(ctx))

	bot.on('text', async ctx => await handlers.handleText(ctx))

	bot.action('random_captains', async ctx => await handlers.handleRandomCaptainsButtonClick(ctx))

	bot.action('cancel_last_chosen_player', async ctx => await handlers.handleLastChosenPlayerCancellation(ctx))
	bot.action('change_sequence', async ctx => await handlers.handleChangeSequenceButtonClick(ctx))
	bot.action('resplit_with_these_captains', async ctx => await handlers.handleResplitWithTheseCaptainsButtonClick(ctx))
	bot.action('change_captains', async ctx => await handlers.handleChangeCaptainsButtonClick(ctx))

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
