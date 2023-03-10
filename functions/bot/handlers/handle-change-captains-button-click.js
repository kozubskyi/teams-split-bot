const { Markup } = require('telegraf')
const { getStore, updateStore } = require('../services/stores-api')
const deleteMessage = require('../helpers/delete-message')
const handleSomethingWentWrong = require('./sub-handlers/handle-something-went-wrong')
const getPlayersButtons = require('../helpers/get-players-buttons')
const handleError = require('./handle-error')
const { STRAIGHT_SEQUENCE } = require('../helpers/constants')
const { RANDOM_CAPTAINS_BUTTON } = require('../helpers/buttons')

module.exports = async function handleChangeCaptainsButtonClick(ctx) {
	try {
		const chatId = ctx.chat.id
		let {
			splitVariant,
			teamsQuantity,
			players,
			captains,
			remainedPlayers,
			sequence,
			captainsChoice,
			currentTeam,
			teamsData,
		} = await getStore(chatId)
		await deleteMessage(ctx)

		if (!splitVariant || !teamsQuantity || !players.length) {
			await handleSomethingWentWrong(ctx)
			return
		}

		captains = []
		remainedPlayers = [...players]
		sequence = STRAIGHT_SEQUENCE
		captainsChoice = ''
		for (let team = 1; team <= teamsQuantity; team++) teamsData[team] = []
		currentTeam = 1

		await updateStore(chatId, { captains, remainedPlayers, sequence, captainsChoice, teamsData, currentTeam })

		const { first_name, last_name } = ctx.from

		const reply = `
<i>Користувач ${first_name}${last_name ? ` ${last_name}` : ''} вирішив переобрати капітанів</i>

Залишилось обрати капітанів: ${teamsQuantity - captains.length}

<b>Капітани:</b>
${Object.keys(teamsData)
	.map((team, i) => (captains[i] ? `${team}. ${captains[i]}` : `${team}. `))
	.join('\n')}`

		const buttons = Markup.inlineKeyboard([[RANDOM_CAPTAINS_BUTTON], ...getPlayersButtons(remainedPlayers)])

		await ctx.replyWithHTML(reply, buttons)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
