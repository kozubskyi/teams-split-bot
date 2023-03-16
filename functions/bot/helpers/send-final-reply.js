const getLineups = require('./get-lineups')
const sendInfoMessageToCreator = require('./send-info-message-to-creator')

module.exports = async function sendFinalReply(ctx, { splitVariant, teamsQuantity, teamsData }) {
	const reply = `
✔️ <b>Поділив</b>
Варіант розподілу: ${splitVariant}
Кількість команд: ${teamsQuantity} ${getLineups(teamsData)}`

	await ctx.replyWithHTML(reply)
	await sendInfoMessageToCreator(ctx, reply)
}
