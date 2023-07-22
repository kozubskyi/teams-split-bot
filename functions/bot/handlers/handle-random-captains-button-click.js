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

module.exports = async function handleRandomCaptainsButtonClick(ctx) {
	try {
		const chatId = ctx.chat.id
		let { splitVariant, teamsQuantity, players, captains, remainedPlayers, teamsData, currentTeam, captainsChoice } =
			await getStore(chatId)
		await deleteMessage(ctx)

		if (!splitVariant || !teamsQuantity || !players.length) return await handleStartCommand(ctx)

		remainedPlayers = [...players]
		captains = []
		captainsChoice = 'Рандомно'
		let teams = Object.keys(teamsData)

		for (let i = 0; i < teamsQuantity; i++) {
			const chosenCaptain = getRandomFromArray(remainedPlayers)
			const chosenTeam = getRandomFromArray(teams)

			captains.push(chosenCaptain)
			teamsData[chosenTeam].push(`1. ${chosenCaptain} (C)`)

			remainedPlayers.splice(remainedPlayers.indexOf(chosenCaptain), 1)
			teams = teams.filter(team => team !== chosenTeam)
		}

		if (remainedPlayers.length === 1) {
			teamsData[currentTeam].push(`2. ${remainedPlayers[0]}`)

			await sendFinalReply(ctx, { splitVariant, teamsQuantity, teamsData })
			return
		}

		await updateStore(ctx, { captains, teamsData, remainedPlayers, captainsChoice })

		const { first_name, last_name } = ctx.from
		const firstPickCaptain = teamsData[currentTeam][0].slice(3, -4)

		const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} вирішив обрати капітанів рандомно</i>

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
