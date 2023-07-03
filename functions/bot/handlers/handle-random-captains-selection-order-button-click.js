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

module.exports = async function handleRandomCaptainsSelectionOrderButtonClick(ctx) {
	try {
		const chatId = ctx.chat.id
		let { splitVariant, teamsQuantity, players, remainedPlayers, captains, teamsData, currentTeam } = await getStore(
			chatId
		)
		await deleteMessage(ctx)

		if (!splitVariant || !teamsQuantity || !players.length) return await handleStartCommand(ctx)

		let remainedCaptains = [...captains]
		let teams = Object.keys(teamsData)

		for (let i = 0; i < teamsQuantity; i++) {
			const chosenCaptain = getRandomFromArray(remainedCaptains)
			const chosenTeam = getRandomFromArray(teams)

			teamsData[chosenTeam].push(`1. ${chosenCaptain} (C)`)

			remainedCaptains.splice(remainedCaptains.indexOf(chosenCaptain), 1)
			teams = teams.filter(team => team !== chosenTeam)
		}

		await updateStore(chatId, { teamsData })

		const { first_name, last_name } = ctx.from
		const firstPickCaptain = teamsData[currentTeam][0].slice(3, -4)

		const reply = `
<i>Користувач ${first_name}${
			last_name ? ` ${last_name}` : ''
		} вирішив обрати рандомну черговість набору гравців капітанами</i>

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
