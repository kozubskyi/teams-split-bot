const { Markup } = require('telegraf')
const deleteMessage = require('../helpers/delete-message')
const { handleChat } = require('../services/chats-api')
const { getStore, updateStore } = require('../services/stores-api')
const handleStartCommand = require('./handle-start-command')
const getRandomFromArray = require('../helpers/get-random-from-array')
const getLineups = require('../helpers/get-lineups')
const getPlayersButtons = require('../helpers/get-players-buttons')
const { getNextChoosingTeam, getPrevChoosingTeam } = require('../helpers/get-choosing-team')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')
const handleError = require('./handle-error')
const { REVERSE_SEQUENCE, DO_NOT_TOUCH_PLAYERS_BUTTONS, CAPTAINS_SPLIT } = require('../helpers/constants')
const {
	CANCEL_LAST_CHOICE_BUTTON,
	CHANGE_SEQUENCE_BUTTON,
	CHANGE_CAPTAINS_BUTTON,
	REMAIN_CAPTAINS_SELECTION_ORDER_BUTTON,
	RANDOM_CAPTAINS_SELECTION_ORDER_BUTTON,
	TRANSFERS_BUTTON,
	FINISH_TRANSFERS_BUTTON,
} = require('../helpers/buttons')

module.exports = async function handlePlayerButtonClick(ctx) {
	try {
		const clickedPlayer = ctx.callbackQuery.data
		if (clickedPlayer === '-') return

		await deleteMessage(ctx)
		await handleChat(ctx)
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

		if (!splitVariant || !teamsQuantity || !players.length) return await handleStartCommand(ctx)

		const { first_name, last_name } = ctx.callbackQuery.from

		const teamsDataPlayersQuantity = teamsData ? Object.values(teamsData).flatMap(arr => arr).length : 0

		if (teamsDataPlayersQuantity === players.length) {
			const preparedClickedPlayer = clickedPlayer.slice(3).trim()

			lastChosenPlayers.push(clickedPlayer)

			if (lastChosenPlayers.length % 2) {
				for (let team = 1; team <= teamsQuantity; team++) {
					const players = teamsData[team]

					if (players.includes(clickedPlayer)) {
						teamsData[team] = players.map(player => (player === clickedPlayer ? null : player))
					}
				}

				await updateStore(ctx, { lastChosenPlayers, teamsData })

				let preparedPlayersArray = []

				for (let i = 0; i < Math.ceil(players.length / teamsQuantity); i++) {
					Object.keys(teamsData).forEach(team => {
						let player = teamsData[team][i]

						if (player === null) player = '-'
						if (player === undefined) player = `${i + 1}. (К${team})`

						preparedPlayersArray.push(player)
					})
				}

				const reply = `
<i>Користувач ${first_name}${
					last_name ? ` ${last_name}` : ''
				} обрав першого гравця для трансфера: ${preparedClickedPlayer}</i>

Оберіть гравця, з яким бажаєте його поміняти`

				const buttons = Markup.inlineKeyboard([
					...getPlayersButtons(preparedPlayersArray, teamsQuantity),
					[FINISH_TRANSFERS_BUTTON],
				])

				await ctx.replyWithHTML(reply, buttons)
			} else {
				const lastChosenPlayer = lastChosenPlayers[lastChosenPlayers.length - 2]

				let preparedPlayersArray = []

				if (clickedPlayer.includes('. (К')) {
					const team = clickedPlayer[clickedPlayer.length - 2]
					const preparedPlayer = `${clickedPlayer.slice(0, 3).trim()} ${lastChosenPlayer.slice(3).trim()}`

					teamsData[team].push(preparedPlayer)

					for (let team = 1; team <= teamsQuantity; team++) {
						const index = teamsData[team].indexOf(null)

						if (index >= 0) {
							teamsData[team].splice(index, 1)

							teamsData[team] = teamsData[team].map((player, i) => `${i + 1}. ${player.slice(3).trim()}`)
						}
					}
				} else {
					for (let team = 1; team <= teamsQuantity; team++) {
						const players = teamsData[team]

						if (players.includes(clickedPlayer)) {
							const index = players.indexOf(clickedPlayer)

							teamsData[team].splice(
								index,
								1,
								`${index + 1}. ${lastChosenPlayer.slice(3).replace(' (C)', '').trim()}${
									splitVariant === CAPTAINS_SPLIT && !index ? ' (C)' : ''
								}`
							)
						}
						if (players.includes(null)) {
							const index = players.indexOf(null)

							teamsData[team].splice(
								index,
								1,
								`${index + 1}. ${preparedClickedPlayer.replace(' (C)', '')}${
									splitVariant === CAPTAINS_SPLIT && !index ? ' (C)' : ''
								}`
							)
						}
					}
				}

				await updateStore(ctx, { lastChosenPlayers, teamsData })

				for (let i = 0; i < Math.ceil(players.length / teamsQuantity); i++) {
					Object.keys(teamsData).forEach(team => {
						const player = teamsData[team][i]
						preparedPlayersArray.push(player ? player : '-')
					})
				}

				let reply = `<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} обрав `
				let transfer = null

				if (clickedPlayer.includes('. (К')) {
					const team = clickedPlayer[clickedPlayer.length - 2]

					transfer = `${lastChosenPlayer} ➡️ Команда ${team}`

					reply += `команду в яку перевести гравця</i>`
				} else {
					transfer = `${lastChosenPlayer} 🔄 ${clickedPlayer}`

					reply += `другого гравця для трансфера: ${preparedClickedPlayer}</i>`
				}

				reply += `

Поточний трансфер:
${transfer}
				
Для завершення трансферів натисніть кнопку "Завершити трансери". Для продовження трансферів далі обирайте гравців.`

				const buttons = Markup.inlineKeyboard([
					...getPlayersButtons(preparedPlayersArray, teamsQuantity),
					[FINISH_TRANSFERS_BUTTON],
				])

				await ctx.replyWithHTML(reply, buttons)
				await sendInfoMessageToCreator(ctx, 'transfer', transfer)
			}

			return
		}

		if (captains.length < teamsQuantity) {
			captains.push(clickedPlayer)
			remainedPlayers.splice(remainedPlayers.indexOf(clickedPlayer), 1)

			if (captains.length === teamsQuantity) {
				await updateStore(ctx, { captains, remainedPlayers, captainsChoice: 'Вказано' })

				const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} обрав останнього ${
					captains.length
				}-го капітана: ${clickedPlayer}</i>
				
<b>Капітани:</b>
${Object.keys(teamsData)
	.map((team, i) => (captains[i] ? `${team}. ${captains[i]}` : `${team}. `))
	.join('\n')}

Оберіть черговість набору гравців капітанами. Залишити як у списку капітанів чи розрахувати випадковим чином (рандомно)?`

				const buttons = Markup.inlineKeyboard([
					[REMAIN_CAPTAINS_SELECTION_ORDER_BUTTON, RANDOM_CAPTAINS_SELECTION_ORDER_BUTTON],
					[CANCEL_LAST_CHOICE_BUTTON],
				])

				await ctx.replyWithHTML(reply, buttons)
				return
			}

			await updateStore(ctx, { captains, remainedPlayers })

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

		await updateStore(ctx, { remainedPlayers, teamsData, currentTeam, lastChosenPlayers })

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

		await updateStore(ctx, { remainedPlayers, teamsData, currentTeam, lastChosenPlayers: [] })

		const reply = `✔️ <b>Поділили</b>
Варіант розподілу: ${splitVariant}
Кількість команд: ${teamsQuantity} ${getLineups(teamsData)}`
		// Капітанів обрано: ${captainsChoice} ${getLineups(teamsData)}

		const buttons = Markup.inlineKeyboard([[TRANSFERS_BUTTON]])

		await ctx.replyWithHTML(reply, buttons)
		await sendInfoMessageToCreator(ctx, reply)
		// await resetStore(ctx)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
