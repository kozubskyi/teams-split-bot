const { Markup } = require('telegraf')
const { getStore, updateStore } = require('../services/stores-api')
const deleteMessage = require('../helpers/delete-message')
const handleStartCommand = require('./handle-start-command')
const { getNextChoosingTeam, getPrevChoosingTeam } = require('../helpers/get-choosing-team')
const getLineups = require('../helpers/get-lineups')
const getPlayersButtons = require('../helpers/get-players-buttons')
const handleError = require('./handle-error')
const { REVERSE_SEQUENCE, DO_NOT_TOUCH_PLAYERS_BUTTONS } = require('../helpers/constants')
const {
	RANDOM_CAPTAINS_BUTTON,
	CANCEL_LAST_CHOICE_BUTTON,
	CHANGE_SEQUENCE_BUTTON,
	CHANGE_CAPTAINS_BUTTON,
} = require('../helpers/buttons')

module.exports = async function handleCancelLastChoiceButtonClick(ctx) {
	try {
		const chatId = ctx.chat.id
		let {
			splitVariant,
			teamsQuantity,
			players,
			captains,
			remainedPlayers,
			currentTeam,
			sequence,
			teamsData,
			lastChosenPlayers,
		} = await getStore(chatId)
		await deleteMessage(ctx)

		if (!splitVariant || !teamsQuantity || !players.length || !captains.length) return await handleStartCommand(ctx)

		const { first_name, last_name } = ctx.from

		if (captains.length + remainedPlayers.length === players.length) {
			const lastChosenCaptain = captains.pop()
			remainedPlayers.push(lastChosenCaptain)

			await updateStore(ctx, { captains, remainedPlayers })

			const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} відмінив вибір ${
				captains.length + 1
			}-го капітана: ${lastChosenCaptain}</i>

Залишилось обрати капітанів: ${teamsQuantity - captains.length}

<b>Капітани:</b>
${Object.keys(teamsData)
	.map((team, i) => (captains[i] ? `${team}. ${captains[i]}` : `${team}. `))
	.join('\n')}`

			const buttons = Markup.inlineKeyboard([
				!captains.length ? [RANDOM_CAPTAINS_BUTTON] : [],
				...getPlayersButtons(remainedPlayers),
				captains.length ? [CANCEL_LAST_CHOICE_BUTTON] : [],
			])

			await ctx.replyWithHTML(reply, buttons)
			return
		}

		if (!lastChosenPlayers.length) return

		const lastChosenPlayer = lastChosenPlayers.pop()

		for (let team = 1; team <= teamsQuantity; team++) {
			if (teamsData[team].includes(lastChosenPlayer)) {
				teamsData[team].splice(teamsData[team].indexOf(lastChosenPlayer), 1)
			}
		}

		const slicedLastChosenPlayer = lastChosenPlayer.slice(3).trim()

		remainedPlayers.push(slicedLastChosenPlayer)

		if (sequence === REVERSE_SEQUENCE) {
			currentTeam = getNextChoosingTeam(currentTeam, teamsQuantity)
		} else {
			currentTeam = getPrevChoosingTeam(currentTeam, teamsQuantity)
		}

		await updateStore(ctx, { remainedPlayers, currentTeam, teamsData, lastChosenPlayers })

		const currentPickCaptain = teamsData[currentTeam][0].slice(3, -4)

		const reply = `
<i>Користувач ${first_name}${
			last_name ? ` ${last_name}` : ''
		} відмінив вибір для Команди ${currentTeam} гравця: ${slicedLastChosenPlayer}</i>

Зараз обирає: <b>${currentPickCaptain}</b> ${getLineups(teamsData)} ${DO_NOT_TOUCH_PLAYERS_BUTTONS}`

		const buttons = Markup.inlineKeyboard([
			...getPlayersButtons(remainedPlayers),
			!(remainedPlayers.length + captains.length === players.length) ? [CANCEL_LAST_CHOICE_BUTTON] : [],
			!((players.length - remainedPlayers.length) % teamsQuantity) ? [CHANGE_SEQUENCE_BUTTON] : [],
			[CHANGE_CAPTAINS_BUTTON],
		])

		await ctx.replyWithHTML(reply, buttons)
	} catch (err) {
		await handleError({ ctx, err })
		console.log({ err })
	}
}
