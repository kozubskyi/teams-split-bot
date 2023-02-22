const { handleStore } = require('../services/stores-api')
const getLineups = require('./get-lineups')
const sendInfoMessageToCreator = require('./send-info-message-to-creator')

module.exports = async function sendFinalReply(ctx, { splitVariant, teamsQuantity, teamsData }) {
	await handleStore(ctx.chat.id) //! потім замінити на resetStore

	const reply = `
✅ <b>Поділив</b>
Варіант розподілу: ${splitVariant}
Кількість команд: ${teamsQuantity} ${getLineups(teamsData)}`

	//! 👇 Чомусь відпрацьовує лише перший з двох рядків
	await ctx.replyWithHTML(reply)
	await sendInfoMessageToCreator(ctx, reply)
}
