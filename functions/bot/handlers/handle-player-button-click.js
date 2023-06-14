const { Markup } = require('telegraf')
const { getStore, updateStore, resetStore } = require('../services/stores-api')
const deleteMessage = require('../helpers/delete-message')
const handleStartCommand = require('./handle-start-command')
const getRandomFromArray = require('../helpers/get-random-from-array')
const getLineups = require('../helpers/get-lineups')
const getPlayersButtons = require('../helpers/get-players-buttons')
const { getNextChoosingTeam, getPrevChoosingTeam } = require('../helpers/get-choosing-team')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')
const handleError = require('./handle-error')
const { REVERSE_SEQUENCE, DO_NOT_TOUCH_PLAYERS_BUTTONS } = require('../helpers/constants')
const { CANCEL_LAST_CHOICE_BUTTON, CHANGE_SEQUENCE_BUTTON, CHANGE_CAPTAINS_BUTTON } = require('../helpers/buttons')

module.exports = async function handlePlayerButtonClick(ctx) {
	try {
		const clickedPlayer = ctx.callbackQuery.data
		if (clickedPlayer === '-') return

		const chatId = ctx.chat.id
		let {
			splitVariant,
			teamsQuantity,
			players,
			captains,
			remainedPlayers,
			captainsChoice,
			teamsData,
			currentTeam,
			lastChosenPlayers,
			sequence,
		} = await getStore(chatId)
		await deleteMessage(ctx)

		if (!splitVariant || !teamsQuantity || !players.length) return await handleStartCommand(ctx)

		const { first_name, last_name } = ctx.callbackQuery.from

		if (captains.length < teamsQuantity) {
			captains.push(clickedPlayer)
			remainedPlayers.splice(remainedPlayers.indexOf(clickedPlayer), 1)

			if (captains.length === teamsQuantity) {
				let remainedCaptains = [...captains]
				let teams = Object.keys(teamsData)

				for (let i = 0; i < teamsQuantity; i++) {
					const chosenCaptain = getRandomFromArray(remainedCaptains)
					const chosenTeam = getRandomFromArray(teams)

					teamsData[chosenTeam].push(`1. ${chosenCaptain} (C)`)

					remainedCaptains.splice(remainedCaptains.indexOf(chosenCaptain), 1)
					teams = teams.filter(team => team !== chosenTeam)
				}

				await updateStore(chatId, { captains, remainedPlayers, teamsData, captainsChoice: 'Вказано' })

				const firstPickCaptain = teamsData[currentTeam][0].slice(3, -4)

				const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} обрав ${teamsQuantity}-го капітана: ${clickedPlayer}</i>

Першим обирає: <b>${firstPickCaptain}</b> ${getLineups(teamsData)} ${DO_NOT_TOUCH_PLAYERS_BUTTONS}`

				const buttons = Markup.inlineKeyboard([
					...getPlayersButtons(remainedPlayers),
					[CHANGE_SEQUENCE_BUTTON],
					[CHANGE_CAPTAINS_BUTTON],
				])

				await ctx.replyWithHTML(reply, buttons)
				return
			}

			await updateStore(chatId, { captains, remainedPlayers })

			const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} обрав ${
				captains.length
			}-го капітана: ${clickedPlayer}</i>

Залишилось обрати капітанів: ${teamsQuantity - captains.length}

<b>Капітани:</b>
${Object.keys(teamsData)
	.map((team, i) => (captains[i] ? `${team}. ${captains[i]}` : `${team}. `))
	.join('\n')}`

			const buttons = Markup.inlineKeyboard([...getPlayersButtons(remainedPlayers), [CANCEL_LAST_CHOICE_BUTTON]])

			await ctx.replyWithHTML(reply, buttons)
			return
		}

		const count = teamsData[currentTeam].length + 1
		const preparedPlayer = `${count}. ${clickedPlayer}`

		lastChosenPlayers.push(preparedPlayer)
		teamsData[currentTeam].push(preparedPlayer)

		remainedPlayers.splice(remainedPlayers.indexOf(clickedPlayer), 1)

		const prevCurrentTeam = currentTeam

		if (sequence === REVERSE_SEQUENCE) {
			currentTeam = getPrevChoosingTeam(currentTeam, teamsQuantity)
		} else {
			currentTeam = getNextChoosingTeam(currentTeam, teamsQuantity)
		}

		await updateStore(chatId, { remainedPlayers, teamsData, currentTeam, lastChosenPlayers })

		const currentPickCaptain = teamsData[currentTeam][0].slice(3, -4)

		if (remainedPlayers.length > 1) {
			const reply = `
<i>Користувач ${first_name}${
				last_name ? ` ${last_name}` : ''
			} для Команди ${prevCurrentTeam} обрав гравця: ${clickedPlayer}</i>
		
Зараз обирає: <b>${currentPickCaptain}</b> ${getLineups(teamsData)} ${DO_NOT_TOUCH_PLAYERS_BUTTONS}`

			const buttons = Markup.inlineKeyboard([
				...getPlayersButtons(remainedPlayers),
				[CANCEL_LAST_CHOICE_BUTTON],
				!((players.length - remainedPlayers.length) % teamsQuantity) ? [CHANGE_SEQUENCE_BUTTON] : [],
				[CHANGE_CAPTAINS_BUTTON],
			])

			await ctx.replyWithHTML(reply, buttons)
			return
		}

		if (remainedPlayers.length === 1) {
			const count = teamsData[currentTeam].length + 1
			const lastPreparedPlayer = `${count}. ${remainedPlayers[0]}`

			lastChosenPlayers.push(lastPreparedPlayer)
			teamsData[currentTeam].push(lastPreparedPlayer)

			remainedPlayers = []
			currentTeam = 1
		}

		await updateStore(chatId, { remainedPlayers, teamsData, currentTeam, lastChosenPlayers })

		const reply = `
✔️ <b>Поділили</b>
Варіант розподілу: ${splitVariant}
Кількість команд: ${teamsQuantity}
Капітанів обрано: ${captainsChoice} ${getLineups(teamsData)}
`
		await ctx.replyWithHTML(reply)
		await sendInfoMessageToCreator(ctx, reply)
		await resetStore(chatId)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
