const deleteMessage = require('../helpers/delete-message')
const { handleChat } = require('../services/chats-api')
const { getStore, updateStore } = require('../services/stores-api')
const handleStartCommand = require('./handle-start-command')
const { SKILL_SPLIT } = require('../helpers/constants')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')
const handleError = require('./handle-error')

module.exports = async function handleTeamsQuantityButtonClick(ctx) {
	try {
		await deleteMessage(ctx)
		await handleChat(ctx)
		let { splitVariant } = await getStore(ctx.chat.id)

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
		await sendInfoMessageToCreator(ctx, 'teamsQuantity')
	} catch (err) {
		await handleError({ ctx, err })
	}
}
