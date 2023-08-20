const { Markup } = require('telegraf')
const deleteMessage = require('../../helpers/delete-message')
const { handleChat } = require('../../services/chats-api')
const handleError = require('../handle-error')
const { HOW_USE_BOT } = require('../../helpers/constants')
const { BACK_TO_QUESTIONS_BUTTON } = require('../../helpers/buttons')

module.exports = async function handleHowUseBotQuestion(ctx) {
	try {
		await deleteMessage(ctx)
		await handleChat(ctx)

		const reply = `
<b>${HOW_USE_BOT}</b>

1. Додаєте бота в чат команди.
2. Натискаєте команду /start
3. Обираєте варіант розподілу.
4. Обираєте кількість команд.
5. Відправляєте список гравців.
6. Якщо обрано варіант розподілу "Капітанами", то обираєте капітанів, а потім кожен по черзі набирає собі гравців у команду. Якщо обрано інший варіант розподілу, то бот самостійно поділить гравців на команди.`

		const buttons = Markup.inlineKeyboard([[BACK_TO_QUESTIONS_BUTTON]])

		await ctx.replyWithHTML(reply, buttons)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
