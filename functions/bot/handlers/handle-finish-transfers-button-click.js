const { Markup } = require('telegraf')
const deleteMessage = require('../helpers/delete-message')
const { handleChat } = require('../services/chats-api')
const { getStore, updateStore } = require('../services/stores-api')
const handleStartCommand = require('./handle-start-command')
const getLineups = require('../helpers/get-lineups')
const { TRANSFERS_BUTTON } = require('../helpers/buttons')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')
const handleError = require('./handle-error')

module.exports = async function handleFinishTransfersButtonClick(ctx) {
	try {
		await deleteMessage(ctx)
		await handleChat(ctx)
		let { splitVariant, teamsQuantity, players, teamsData, lastChosenPlayers } = await getStore(ctx.chat.id)

		const teamsDataPlayersQuantity = teamsData ? Object.values(teamsData).flatMap(arr => arr).length : 0

		if (!splitVariant || !teamsQuantity || !players.length || teamsDataPlayersQuantity !== players.length) {
			await handleStartCommand(ctx)
			return
		}

		if (lastChosenPlayers.length % 2) {
			const lastChosenPlayer = lastChosenPlayers.pop()

			Object.keys(teamsData).forEach(team => {
				const players = teamsData[team]

				if (players.includes(null)) {
					teamsData[team] = players.map((player, i) => (player === null ? lastChosenPlayer : player))
				}
			})
		}

		const { first_name, last_name } = ctx.from

		if (lastChosenPlayers.length) {
			const transfers = lastChosenPlayers.reduce((acc, player, i, arr) => {
				if (i % 2) {
					return `${acc} ${player.includes('. (К') ? `➡️ Команда ${player[player.length - 2]}` : `🔄 ${player}`}\n`
				} else {
					return `${acc}${player}`
				}
			}, '')

			const transfersReply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} підтвердив трансфери:</i>

${transfers}`

			await ctx.replyWithHTML(transfersReply)
			await sendInfoMessageToCreator(ctx, 'finishTransfers', transfers)
		}

		const reply = `
✔️ <b>${lastChosenPlayers.length ? 'Поділили' : 'Поділив'}</b>
Варіант розподілу: ${splitVariant}${lastChosenPlayers.length ? ' з трансферами' : ''}
Кількість команд: ${teamsQuantity} ${getLineups(teamsData)}`

		const buttons = Markup.inlineKeyboard([[TRANSFERS_BUTTON]])

		await updateStore(ctx, { lastChosenPlayers: [], teamsData })

		await ctx.replyWithHTML(reply, buttons)
		await sendInfoMessageToCreator(ctx, reply)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
