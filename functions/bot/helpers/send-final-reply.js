const { Markup } = require('telegraf')
// const { resetStore } = require('../services/stores-api')
const getLineups = require('./get-lineups')
const sendInfoMessageToCreator = require('./send-info-message-to-creator')
const { TRANSFERS_BUTTON } = require('./buttons')

module.exports = async function sendFinalReply(ctx, { splitVariant, teamsQuantity, teamsData }) {
	const reply = `✔️ <b>Поділив</b>
Варіант розподілу: ${splitVariant}
Кількість команд: ${teamsQuantity} ${getLineups(teamsData)}`

	const buttons = Markup.inlineKeyboard([[TRANSFERS_BUTTON]])

	await ctx.replyWithHTML(reply, buttons)
	await sendInfoMessageToCreator(ctx, reply)
	// await resetStore(ctx)
}
