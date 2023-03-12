const { Markup } = require('telegraf')
const { handleStore } = require('../services/stores-api')
const handleError = require('./handle-error')
const { CAPTAINS_SPLIT, SKILL_SPLIT, RANDOM_SPLIT } = require('../helpers/constants')
const { CAPTAINS_SPLIT_BUTTON, SKILL_SPLIT_BUTTON, RANDOM_SPLIT_BUTTON } = require('../helpers/buttons')

module.exports = async function handleStartCommand(ctx) {
	await handleStore(ctx.chat.id)

	const reply = `
Я бот, що був створений для розподілу гравців на команди у футболі та інших командних іграх. Для початку оберіть варіант розподілу:

<b>${CAPTAINS_SPLIT}</b> - оберемо капітанів і потім кожен з них по черзі набере собі гравців у команду.

<b>${SKILL_SPLIT}</b> - поділю гравців на команди, враховуючи індивідуальні навички кожного гравця.

<b>${RANDOM_SPLIT}</b> - поділю гравців на команди випадковим чином.
`
	const buttons = Markup.inlineKeyboard([[CAPTAINS_SPLIT_BUTTON], [SKILL_SPLIT_BUTTON, RANDOM_SPLIT_BUTTON]])

	await ctx.replyWithHTML(reply, buttons)
}
