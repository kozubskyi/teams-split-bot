const { Markup } = require('telegraf')
const { getStore, updateStore } = require('../services/stores-api')
const deleteMessage = require('../helpers/delete-message')
const handleStartCommand = require('./handle-start-command')
const getRandomFromArray = require('../helpers/get-random-from-array')
const getLineups = require('../helpers/get-lineups')
const getPlayersButtons = require('../helpers/get-players-buttons')
const sendFinalReply = require('../helpers/send-final-reply')
const handleError = require('./handle-error')
const { DO_NOT_TOUCH_PLAYERS_BUTTONS } = require('../helpers/constants')
const { CHANGE_SEQUENCE_BUTTON, CHANGE_CAPTAINS_BUTTON } = require('../helpers/buttons')

module.exports = async function handleRemainCaptainsSelectionOrderButtonClick(ctx) {
	try {
		const chatId = ctx.chat.id
		let { splitVariant, teamsQuantity, players, captains, remainedPlayers, teamsData } = await getStore(chatId)
		await deleteMessage(ctx)

		if (!splitVariant || !teamsQuantity || !players.length) return await handleStartCommand(ctx)

		captains.forEach((captain, i) => teamsData[i + 1].push(`1. ${captain} (C)`))

		await updateStore(ctx, { teamsData })

		const { first_name, last_name } = ctx.from
		// const firstPickCaptain = teamsData[currentTeam][0].slice(3, -4)
		const firstPickCaptain = captains[0]

		const reply = `
<i>Користувач ${first_name}${
			last_name ? ` ${last_name}` : ''
		} вирішив залишити черговість набору гравців капітанами таку як було обрано капітанів</i>

Першим обирає: <b>${firstPickCaptain}</b> ${getLineups(teamsData)} ${DO_NOT_TOUCH_PLAYERS_BUTTONS}`

		const buttons = Markup.inlineKeyboard([
			...getPlayersButtons(remainedPlayers),
			[CHANGE_SEQUENCE_BUTTON],
			[CHANGE_CAPTAINS_BUTTON],
		])

		await ctx.replyWithHTML(reply, buttons)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
