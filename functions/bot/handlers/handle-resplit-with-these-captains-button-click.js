const { store } = require('../store')
const { replies, getLineups, getPlayerButtons } = require('../helpers')
const { splitVariantButtons, teamsQuantityButtons } = require('../helpers/buttons')
const { getNextChoosingTeam, getPrevChoosingTeam } = require('../helpers/get-choosing-team')
const handleStartCommand = require('./handle-start-command')
const handleError = require('./handle-error')

module.exports = async function handleResplitWithTheseCaptainsButtonClick(ctx) {
	try {
		if (!store.splitVariant || !store.teamsQuantity || !store.players.length || !store.captains.length) {
			await ctx.reply(replies.noActivityForLongTime)
			await handleStartCommand(ctx)
			return
		}

		store.remainedPlayers = [...store.players]
		store.captains.forEach(captain => store.remainedPlayers.splice(store.remainedPlayers.indexOf(captain), 1))
		for (let team = 1; team <= store.teamsQuantity; team++) store.teamsData[team].length = 1
		store.currentTeam = 1
		store.sequense = 'straight'

		const currentPickCaptain = store.teamsData[store.currentTeam][0].slice(3, -4)

		const { first_name, last_name } = ctx.callbackQuery.from

		const reply = `
<i>ℹ️ ${first_name}${last_name ? ` ${last_name}` : ''} вирішив переділитися цими ж капітанами</i>

Зараз обирає: <b>${currentPickCaptain}</b> ${getLineups()} ${replies.dontTouchPlayerButtons}
`
		store.lastChosenPlayer = ''

		await ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id)
		await ctx.replyWithHTML(reply, getPlayerButtons(store.remainedPlayers))
	} catch (err) {
		await handleError(err, ctx)
	}
}
