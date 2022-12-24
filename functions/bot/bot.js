require('dotenv').config()
const { Telegraf } = require('telegraf')
const handlers = require('./handlers')
const { resetStore } = require('./store')

const bot = new Telegraf(process.env.BOT_TOKEN)

function start() {
  // Start command handler
  bot.start(async (ctx) => await handlers.handleStartCommand(ctx))
  // Stop command handler
  bot.command('stop', (ctx) => resetStore())

  // SplitVariant button handlers
  bot.action('skill_split', async (ctx) => await handlers.handleSplitVariant(ctx))
  bot.action('random_split', async (ctx) => await handlers.handleSplitVariant(ctx))
  bot.action('captains_split', async (ctx) => await handlers.handleSplitVariant(ctx))

  // TeamsQuantity button handlers
  bot.action('2_teams', async (ctx) => await handlers.handleTeamsQuantity(ctx))
  bot.action('3_teams', async (ctx) => await handlers.handleTeamsQuantity(ctx))
  bot.action('4_teams', async (ctx) => await handlers.handleTeamsQuantity(ctx))

  // Text handler
  bot.on('text', async (ctx) => await handlers.handleText(ctx))

  // RandomCaptains button handler
  bot.action('random_captains', async (ctx) => await handlers.handleCaptains(ctx))

  // PlayerButtons handler
  bot.on('callback_query', async (ctx) => await handlers.handlePlayerButton(ctx))

  // Sticker handler
  // bot.on('sticker', async (ctx) => await ctx.reply('👍'))

  console.log('✅ The bot is configured and must work correctly')
}

start()

// bot.launch()

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
