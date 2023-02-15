const { store, resetStore } = require('../store')
const getButtonText = require('./get-button-text')
const getLineups = require('./get-lineups')
const sendInfoMessageToCreator = require('./send-info-message-to-creator')

module.exports = async function sendFinalReply(ctx) {
	const reply = `
✅ <b>Поділив</b>
Варіант розподілу: ${getButtonText()}
Кількість команд: ${store.teamsQuantity} ${getLineups()}
`
	resetStore()

	//! 👇 Чомусь відпрацьовує лише перший з двох рядків
	await ctx.replyWithHTML(reply)
	await sendInfoMessageToCreator(ctx, reply)
}
