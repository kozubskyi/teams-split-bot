const { handleChat } = require('../../services/chats-api')
const { handleStore } = require('../../services/stores-api')
const deleteMessage = require('../../helpers/delete-message')
const handleError = require('../handle-error')
const { HOW_USE_BOT } = require('../../helpers/constants')

module.exports = async function handleHowUseBotQuestion(ctx) {
	try {
		await handleChat(ctx)
		await handleStore(ctx.chat.id)
		await deleteMessage(ctx)

		const reply = `
<b>${HOW_USE_BOT}</b>

1. Натискаєте команду /start
2. Обираєте варіант розподілу.
3. Обираєте кількість команд.
4. Відправляєте список гравців.
5. Якщо обрано варіант розподілу "Капітанами", то обираєте капітанів, а потім кожен по черзі набирає собі гравців у команду. Якщо обрано інщий варіант розподілу, то бот самостійно поділить гравців на команди.`

		await ctx.replyWithHTML(reply)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
