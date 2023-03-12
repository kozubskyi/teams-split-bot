const { Markup } = require('telegraf')
const { getStore, updateStore } = require('../services/stores-api')
const deleteMessage = require('../helpers/delete-message')
const handleStartCommand = require('./handle-start-command')
const { getNextChoosingTeam, getPrevChoosingTeam } = require('../helpers/get-choosing-team')
const getLineups = require('../helpers/get-lineups')
const getPlayersButtons = require('../helpers/get-players-buttons')
const handleError = require('./handle-error')
const { STRAIGHT_SEQUENCE, REVERSE_SEQUENCE, DO_NOT_TOUCH_PLAYERS_BUTTONS } = require('../helpers/constants')
const { CANCEL_LAST_CHOICE_BUTTON, CHANGE_SEQUENCE_BUTTON, CHANGE_CAPTAINS_BUTTON } = require('../helpers/buttons')

module.exports = async function handleChangeCaptainsButtonClick(ctx) {
	try {
		const chatId = ctx.chat.id
		let { splitVariant, teamsQuantity, players, captains, remainedPlayers, sequence, currentTeam, teamsData } =
			await getStore(chatId)
		await deleteMessage(ctx)

		if (!splitVariant || !teamsQuantity || !players.length || !captains.length) return await handleStartCommand(ctx)

		sequence = sequence === STRAIGHT_SEQUENCE ? REVERSE_SEQUENCE : STRAIGHT_SEQUENCE

		if (sequence === REVERSE_SEQUENCE) {
			currentTeam = getPrevChoosingTeam(currentTeam, teamsQuantity)
		} else {
			currentTeam = getNextChoosingTeam(currentTeam, teamsQuantity)
		}

		await updateStore(chatId, { sequence, currentTeam })

		const currentPickCaptain = teamsData[currentTeam][0].slice(3, -4)

		const { first_name, last_name } = ctx.from

		const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} вирішив змінити послідовність вибору</i>

Зараз обирає: <b>${currentPickCaptain}</b> ${getLineups(teamsData)} ${DO_NOT_TOUCH_PLAYERS_BUTTONS}`

		const buttons = Markup.inlineKeyboard([
			...getPlayersButtons(remainedPlayers),
			// !(remainedPlayers.length + captains.length === players.length) ? [CANCEL_LAST_CHOICE_BUTTON] : [],
			!((players.length - remainedPlayers.length) % teamsQuantity) ? [CHANGE_SEQUENCE_BUTTON] : [],
			[CHANGE_CAPTAINS_BUTTON],
		])

		await ctx.replyWithHTML(reply, buttons)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
