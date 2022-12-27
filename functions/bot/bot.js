require('dotenv').config()
const { text } = require('stream/consumers')
const { Telegraf } = require('telegraf')
const handlers = require('./handlers')
const textHandlers = require('./handlers/text-handlers')
const { resetStore } = require('./store')

const bot = new Telegraf(process.env.BOT_TOKEN)

function start() {
  // Start command handler
  bot.start(async (ctx) => await handlers.handleStartCommand(ctx))
  // Stop command handler
  bot.command('stop', (ctx) => resetStore())

  // Split Variant button handlers
  bot.action('skill_split', async (ctx) => await handlers.handleSplitVariantButtonClick(ctx))
  bot.action('random_split', async (ctx) => await handlers.handleSplitVariantButtonClick(ctx))
  bot.action('captains_split', async (ctx) => await handlers.handleSplitVariantButtonClick(ctx))

  // Teams Quantity button handlers
  bot.action('2_teams', async (ctx) => await handlers.handleTeamsQuantityButtonClick(ctx))
  bot.action('3_teams', async (ctx) => await handlers.handleTeamsQuantityButtonClick(ctx))
  bot.action('4_teams', async (ctx) => await handlers.handleTeamsQuantityButtonClick(ctx))

  // Text handler
  bot.on('text', async (ctx) => await handlers.handleText(ctx))

  // Random Captains button handler
  bot.action('random_captains', async (ctx) => await handlers.handleRandomCaptainsButtonClick(ctx))

  // Cancel last chosen player button handler
  bot.action('cancel_last_chosen_player', async (ctx) => await handlers.handleLastChosenPlayerCancellation(ctx))

  // Change captains button handler
  bot.action('change_captains', async (ctx) => await handlers.handleChangeCaptainsButtonClick(ctx))

  // Any button (in my case - Player Buttons) handler
  bot.on('callback_query', async (ctx) => await handlers.handlePlayerButtonClick(ctx))

  // Sticker handler
  bot.on('sticker', async (ctx) => await ctx.reply('👍'))

  console.log('✅ The bot is configured and must work correctly')
}

start()

bot.launch()

// Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async (event) => {
  try {
    await bot.handleUpdate(JSON.parse(event.body))
    return { statusCode: 200, body: '' }
  } catch (e) {
    console.error('error in handler:', e)
    return { statusCode: 400, body: 'This endpoint is meant for bot and telegram communication' }
  }
}
