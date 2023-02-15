const { Markup } = require('telegraf')
const { store } = require('../../../client/functions/bot/store')
const { replies, buttons } = require('../helpers')
const handleStartCommand = require('./handle-start-command')
const handleError = require('./handle-error')

module.exports = async function handleChangeCaptainsButtonClick(ctx) {
	try {
		if (!store.splitVariant || !store.teamsQuantity || !store.players.length) {
			await ctx.reply(replies.noActivityForLongTime)
			await handleStartCommand(ctx)
			return
		}

		store.captains = []
		store.remainedPlayers = []
		store.remainedCaptains = []
		store.captainsChoice = ''
		for (let i = 1; i <= store.teamsQuantity; i++) store.teamsData[i] = []
		store.currentTeam = 1
		store.lastChosenPlayer = ''

		const { first_name, last_name } = ctx.callbackQuery.from

		const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} вирішив обрати інших капітанів</i>

Натисність на кнопку нижче і я самостійно випадковим чином оберу капітанів зі списку гравців, або відправте список з ${
			store.teamsQuantity
		}-х капітанів.
		`
		await ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id)
		await ctx.replyWithHTML(reply, Markup.inlineKeyboard(buttons.randomCaptainsButton))

		store.list = 'captains'
	} catch (err) {
		await handleError(err, ctx)
	}
}
