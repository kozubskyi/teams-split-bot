const { store, resetStore } = require('../store')
const { replies, getButtonText, getLineups, getPlayerButtons, sendInfoMessageToCreator } = require('../helpers')
const { getNextChoosingTeam, getPrevChoosingTeam } = require('../helpers/get-choosing-team')
const { splitVariantButtons, teamsQuantityButtons } = require('../../../../functions/bot/helpers/buttons')
const handleStartCommand = require('./handle-start-command')
const handleError = require('./handle-error')

module.exports = async function handlePlayerButtonClick(ctx) {
	try {
		if (!store.splitVariant || !store.teamsQuantity || !store.players.length) {
			await ctx.reply(replies.noActivityForLongTime)
			await handleStartCommand(ctx)
			return
		}

		const clickedPlayer = ctx.callbackQuery.data
		if (clickedPlayer === '-') return

		const count = store.teamsData[store.currentTeam].length + 1
		const preparedPlayer = `${count}. ${clickedPlayer}`

		store.lastChosenPlayers.push(preparedPlayer)
		store.teamsData[store.currentTeam].push(preparedPlayer)

		store.remainedPlayers.splice(store.remainedPlayers.indexOf(clickedPlayer), 1)

		const { first_name, last_name } = ctx.callbackQuery.from

		if (store.sequence === 'reverse') {
			store.currentTeam = getPrevChoosingTeam()
		} else {
			store.currentTeam = getNextChoosingTeam()
		}

		const currentPickCaptain = store.teamsData[store.currentTeam][0].slice(3, -4)

		let reply = ''

		if (store.remainedPlayers.length > 1) {
			reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} для Команди ${
				store.currentTeam
			} обрав гравця: ${clickedPlayer}</i>
		
Зараз обирає: <b>${currentPickCaptain}</b> ${getLineups()} ${replies.dontTouchPlayerButtons}
`
			await ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id)
			await ctx.replyWithHTML(reply, getPlayerButtons(store.remainedPlayers))
			return
		}
		if (store.remainedPlayers.length === 1) {
			const count = store.teamsData[store.currentTeam].length + 1
			store.teamsData[store.currentTeam].push(`${count}. ${store.remainedPlayers[0]}`)
		}

		reply = `
✅ <b>Поділили</b>
Варіант розподілу: ${getButtonText()}
Кількість команд: ${store.teamsQuantity}
Капітанів обрано: ${store.captainsChoice} ${getLineups()}
`
		await ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id)
		await ctx.replyWithHTML(reply)

		await sendInfoMessageToCreator(ctx, reply)
		resetStore()
	} catch (err) {
		await handleError(err, ctx)
	}
}
