const { store } = require('../store')
const { replies, getLineups, getPlayerButtons } = require('../helpers')
const { splitVariantButtons, teamsQuantityButtons } = require('../../../../functions/bot/helpers/buttons')
const { getNextChoosingTeam, getPrevChoosingTeam } = require('../helpers/get-choosing-team')
const handleStartCommand = require('./handle-start-command')
const handleError = require('./handle-error')

module.exports = async function handleLastChosenPlayerCancellation(ctx) {
	try {
		if (
			!store.splitVariant ||
			!store.teamsQuantity ||
			!store.players.length ||
			!store.captains.length ||
			!store.lastChosenPlayers.length
		) {
			await ctx.reply(replies.noActivityForLongTime)
			await handleStartCommand(ctx)
			return
		}

		const lastChosenPlayer = store.lastChosenPlayers.pop()

		for (let team = 1; team <= store.teamsQuantity; team++) {
			if (store.teamsData[team].includes(lastChosenPlayer)) {
				store.teamsData[team].splice(store.teamsData[team].indexOf(lastChosenPlayer), 1)
			}
		}

		const slicedLastChosenPlayer = lastChosenPlayer.slice(3).trim()

		store.remainedPlayers.push(slicedLastChosenPlayer)

		if (store.sequence === 'reverse') {
			store.currentTeam = getNextChoosingTeam()
		} else {
			store.currentTeam = getPrevChoosingTeam()
		}

		const currentPickCaptain = store.teamsData[store.currentTeam][0].slice(3, -4)

		const { first_name, last_name } = ctx.callbackQuery.from

		const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} відмінив вибір для Команди ${
			store.currentTeam
		} гравця ${slicedLastChosenPlayer}</i>

Зараз обирає: <b>${currentPickCaptain}</b> ${getLineups()} ${replies.dontTouchPlayerButtons}
`
		store.lastChosenPlayer = ''

		await ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id)
		await ctx.replyWithHTML(reply, getPlayerButtons(store.remainedPlayers))
	} catch (err) {
		await handleError(err, ctx)
	}
}
