const deleteMessage = require('../helpers/delete-message')
const { handleChat } = require('../services/chats-api')
const { getStore, updateStore } = require('../services/stores-api')
const handleStartCommand = require('./handle-start-command')
const handleError = require('./handle-error')
const { SKILL_SPLIT } = require('../helpers/constants')

module.exports = async function handleTeamsQuantityButtonClick(ctx) {
	try {
		await deleteMessage(ctx)
		await handleChat(ctx)
		const chatId = ctx.chat.id
		let { splitVariant } = await getStore(chatId)

		if (!splitVariant) return await handleStartCommand(ctx)

		const teamsQuantity = Number(ctx.callbackQuery.data[0])
		const teamsData = {}
		for (let team = 1; team <= teamsQuantity; team++) teamsData[team] = []

		await updateStore(ctx, { teamsQuantity, teamsData })

		const { first_name, last_name } = ctx.from

		let reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} обрав кількість команд: ${teamsQuantity}</i>

Відправте список гравців де кожний наступний гравець вказаний з нового рядка`

		if (splitVariant === SKILL_SPLIT) {
			reply = `
${reply}

<i>❗Ви обрали розподіл "За скілом", тому обов'язково потрібно відправити список гравців, сформований від найкращого до найгіршого гравця. Чим більш об'єктивно буде сформовано список тим більш справедливо будуть поділені команди.</i>`
		}

		await ctx.replyWithHTML(reply)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
