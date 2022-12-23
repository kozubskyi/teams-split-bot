require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
// const TelegramBot = require('node-telegram-bot-api')
const handlers = require('./handlers')
const { getLineups, getRandomFromArray, sendInfoMessageToCreator, getButtonText } = require('./helpers')
const { handleSkillSplit, handleRandomSplit } = require('./handlers/split-handlers')

const bot = new Telegraf(process.env.BOT_TOKEN)
// const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

function start() {
  // bot.setMyCommands([
  //   { command: '/start', description: '🤙 Start' },
  //   { command: '/test', description: 'Test' },
  // ])

  let splitVariant = ''
  let teamsQuantity = 0
  let players = []
  let teamsData = {}

  // Start command handler
  // bot.start(async (ctx) => await handleStartCommand(ctx))
  bot.command('start', async (ctx) => {
    await handlers.handleStartCommand(ctx)
  })

  // Split version buttons click handlers
  bot.action('skill_split', async (ctx) => {
    splitVariant = 'skill_split'
    await handlers.handleSplitVariantClick(ctx)
  })
  bot.action('random_split', async (ctx) => {
    splitVariant = 'random_split'
    await handlers.handleSplitVariantClick(ctx)
  })
  bot.action('captains_split', async (ctx) => {
    splitVariant = 'captains_split'
    await handlers.handleSplitVariantClick(ctx)
  })

  // Teams quantity buttons click handlers
  bot.action('2_teams', async (ctx) => {
    teamsQuantity = 2
    await handlers.handleTeamsQuantityClick(ctx, splitVariant)
  })
  bot.action('3_teams', async (ctx) => {
    teamsQuantity = 3
    await handlers.handleTeamsQuantityClick(ctx, splitVariant)
  })
  bot.action('4_teams', async (ctx) => {
    teamsQuantity = 4
    await handlers.handleTeamsQuantityClick(ctx, splitVariant)
  })

  // Players list handler
  bot.on('text', async (ctx) => {
    if (!teamsQuantity || !splitVariant) {
      // await ctx.reply('Для початку введіть команду /start')
      await ctx.reply('ALARM - TREBA /start')
      return
    }

    players = ctx.message.text.split('\n')
    for (let i = 1; i <= teamsQuantity; i++) teamsData[i] = []

    try {
      if (splitVariant === 'captains_split') {
        await ctx.reply(
          'Як оберемо капітанів?',
          Markup.inlineKeyboard([
            [
              Markup.button.callback('Ви вкажете', 'specified_captains'),
              Markup.button.callback('Я оберу', 'random_captains'),
            ],
          ])
        )
      } else {
        if (splitVariant === 'skill_split') {
          teamsData = handleSkillSplit(players, teamsData)
        }
        if (splitVariant === 'random_split') {
          teamsData = handleRandomSplit(players, teamsData)
        }

        const reply = `
✅ <b>Поділив</b>
Варіант розподілу: ${getButtonText(splitVariant)}
Кількість команд: ${teamsQuantity} ${getLineups(teamsData)}
`

        await ctx.replyWithHTML(reply)

        splitVariant = ''
        teamsQuantity = 0
        players = []
        teamsData = {}

        await sendInfoMessageToCreator(ctx, reply)
      }
    } catch (err) {
      await handlers.handleError(err, ctx)
    }
  })

  // bot.action('specified_captains', (ctx) => ctx.reply(JSON.stringify(ctx)))
  bot.action('random_captains', async (ctx) => {
    let possibleCaptains = [...players]
    const captains = []

    for (let i = 1; i <= teamsQuantity; i++) {
      const chosenCaptain = getRandomFromArray(possibleCaptains)

      captains.push(chosenCaptain)

      possibleCaptains = possibleCaptains.filter((player) => player !== chosenCaptain)
    }

    await ctx.replyWithHTML(`
✔️ Поділив наступним чином:
        ${teams
          .map((teamName) => {
            return `
<b>Команда ${teamName}:</b>
${teamsData[teamName].join('\n')}
            `
          })
          .join('')}
        `)
  })

  // Sticker handler
  bot.on('sticker', (ctx) => ctx.reply('👍'))

  // for node-telegram-bot-api
  // bot.on('message', (msg) => bot.sendMessage(CREATOR_CHAT_ID, 'test'))
  // bot.on('polling_error', console.log)

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
