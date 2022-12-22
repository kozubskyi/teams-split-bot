require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
// const TelegramBot = require('node-telegram-bot-api')
const { BOT_USERNAME, CREATOR_USERNAME, CREATOR_CHAT_ID } = require('./helpers/constants')
const handleStartCommand = require('./handlers/handle-start-command')
const { onSplitVersionClick, onTeamsQuantityClick } = require('./handlers/on-buttons-click')
const { handleSkillSplit, handleRandomSplit } = require('./handlers/split-handlers')

const bot = new Telegraf(process.env.BOT_TOKEN)
// const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

function start() {
  // bot.setMyCommands([
  //   { command: '/start', description: '🤙 Start' },
  //   { command: '/test', description: 'Test' },
  // ])

  let splitVersion = ''
  let teamsQuantity = 0

  // Start command handler
  // bot.start(async (ctx) => await handleStartCommand(ctx))
  bot.command('start', async (ctx) => await handleStartCommand(ctx))

  // Split version buttons click handlers
  bot.action('skill_split', async (ctx) => {
    splitVersion = 'skill_split'
    await onSplitVersionClick(ctx)
  })
  bot.action('random_split', async (ctx) => {
    splitVersion = 'random_split'
    await onSplitVersionClick(ctx)
  })

  // Teams quantity buttons click handlers
  bot.action('2_teams', async (ctx) => {
    teamsQuantity = 2
    await onTeamsQuantityClick(ctx, splitVersion)
  })
  bot.action('3_teams', async (ctx) => {
    teamsQuantity = 3
    await onTeamsQuantityClick(ctx, splitVersion)
  })
  bot.action('4_teams', async (ctx) => {
    teamsQuantity = 4
    await onTeamsQuantityClick(ctx, splitVersion)
  })

  // Players list handler
  bot.on('text', async (ctx) => {
    const firstName = ctx.message.from.first_name
    const lastName = ctx.message.from.last_name
    const username = ctx.message.from.username
    const chatId = ctx.message.chat.id
    const text = ctx.message.text

    try {
      if (!teamsQuantity || !splitVersion) {
        // await ctx.reply('Для початку введіть команду /start')
        return
      }

      await ctx.reply('Готую склади...')

      const players = ctx.message.text.split('\n')
      let teamsData = {}
      for (let i = 1; i <= teamsQuantity; i++) teamsData[i] = []
      const teams = Object.keys(teamsData)

      if (splitVersion === 'skill_split') {
        teamsData = handleSkillSplit(players, teamsData)
      }
      if (splitVersion === 'random_split') {
        teamsData = handleRandomSplit(players, teamsData)
      }

      const reply = `
✔️ Поділив наступним чином:
        ${teams
          .map((teamName) => {
            return `
<b>Команда ${teamName}:</b>
${teamsData[teamName].join('\n')}
            `
          })
          .join('')}
        `

      await ctx.replyWithHTML(reply)

      splitVersion = ''
      teamsQuantity = 0

      username !== CREATOR_USERNAME &&
        (await ctx.telegram.sendMessage(
          CREATOR_CHAT_ID,
          `
ℹ️ Користувач "${firstName} ${lastName} <${username}> (${chatId})" щойно поділив свої команди:

${reply}
          `
        ))
    } catch (err) {
      username !== CREATOR_USERNAME && (await ctx.reply('Виникли технічні неполадки, скоро полагоджусь і повернусь 👨‍🔧'))

      await ctx.telegram.sendMessage(
        CREATOR_CHAT_ID,
        `❌ Помилка! Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${text}" і виникла помилка "${
          err?.response?.data?.message ?? err
        }"`
      )
    }
  })

  // Sticker handler
  bot.on('sticker', (ctx) => ctx.reply('👍'))

  // for node-telegram-bot-api
  // bot.on('message', (msg) => bot.sendMessage(CREATOR_CHAT_ID, 'test'))
  // bot.on('polling_error', console.log)

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
