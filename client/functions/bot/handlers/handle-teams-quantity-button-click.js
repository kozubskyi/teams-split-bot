const { store, resetStore } = require('../store')
const { replies, buttons, getButtonText } = require('../helpers')
const handleStartCommand = require('./handle-start-command')
const handleError = require('./handle-error')

module.exports = async function handleTeamsQuantityButtonClick(ctx) {
	try {
		if (!store.splitVariant) {
			await ctx.reply(replies.noActivityForLongTime)
			await handleStartCommand(ctx)
			return
		}

		const { first_name, last_name } = ctx.callbackQuery.from
		store.teamsQuantity = Number(ctx.callbackQuery.data[0])
		store.teamsQuantityChooser = `${first_name}${last_name ? ` ${last_name}` : ''}`
		store.list = 'players'

		for (let team = 1; team <= store.teamsQuantity; team++) store.teamsData[team] = []

		let reply = `
<i>Користувач ${store.teamsQuantityChooser} обрав кількість команд: ${store.teamsQuantity}</i>

Відправте список гравців де кожний наступний гравець вказаний з нового рядка
`

		if (store.splitVariant === 'skill_split') {
			reply = `
${reply}

<i>❗Ви обрали розподіл "За скілом", тому обов'язково потрібно відправити список гравців, сформований від найкращого до найгіршого гравця (на вашу суб'єктивну думку)</i>
`
		}

		await ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id)
		await ctx.replyWithHTML(reply)
	} catch (err) {
		await handleError(err, ctx)
	}
}
