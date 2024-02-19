const { Markup } = require('telegraf')
const { handleChat } = require('../services/chats-api')
const { getStore } = require('../services/stores-api')
const handleStartCommand = require('./handle-start-command')
const { FINISH_TRANSFERS_BUTTON } = require('../helpers/buttons')
const getPlayersButtons = require('../helpers/get-players-buttons')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')
const handleError = require('./handle-error')

module.exports = async function handleTransfersButtonClick(ctx) {
	try {
		await handleChat(ctx)
		let { teamsQuantity, players, teamsData } = await getStore(ctx.chat.id)

		const teamsDataPlayersQuantity = teamsData ? Object.values(teamsData).flatMap(arr => arr).length : 0

		if (players.length === 0 || teamsDataPlayersQuantity !== players.length) return await handleStartCommand(ctx)

		let preparedPlayersArray = []

		const teams = Object.keys(teamsData)

		for (let i = 0; i < Math.ceil(players.length / teamsQuantity); i++) {
			teams.forEach(team => {
				const player = teamsData[team][i]
				preparedPlayersArray.push(player ? player : '-')
			})
		}

		const { first_name, last_name } = ctx.from

		const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} вирішив зробити трансфери</i>

Оберіть гравця, якого бажаєте поміняти`

		const buttons = Markup.inlineKeyboard([
			...getPlayersButtons(preparedPlayersArray, teamsQuantity),
			[FINISH_TRANSFERS_BUTTON],
		])

		await ctx.replyWithHTML(reply, buttons)
		await sendInfoMessageToCreator(ctx, 'transfers')
	} catch (err) {
		await handleError({ ctx, err })
	}
}
