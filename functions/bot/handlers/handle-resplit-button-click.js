const { Markup } = require('telegraf')
const { handleChat } = require('../services/chats-api')
const { getStore, updateStore } = require('../services/stores-api')
const splitHandlers = require('./split-handlers')
const getPlayersButtons = require('../helpers/get-players-buttons')
const sendFinalReply = require('../helpers/send-final-reply')
const handleError = require('./handle-error')
const {
	CAPTAINS_SPLIT,
	SKILL_SPLIT,
	RANDOM_SPLIT,
	STRAIGHT_SEQUENCE,
} = require('../helpers/constants')
const { RANDOM_CAPTAINS_BUTTON } = require('../helpers/buttons')
//! const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')

module.exports = async function handleResplitButtonClick(ctx) {
	try {
		await handleChat(ctx)
		let { splitVariant, teamsQuantity, players } = await getStore(ctx.chat.id)

		if (!splitVariant || !teamsQuantity || !players.length) return

		let teamsData = {}
		for (let team = 1; team <= teamsQuantity; team++) teamsData[team] = []

		if (splitVariant === CAPTAINS_SPLIT) {
			await updateStore(ctx, {
				remainedPlayers: players,
				captains: [],
				lastChosenPlayers: [],
				captainsChoise: '',
				sequence: STRAIGHT_SEQUENCE,
				currentTeam: 1,
				teamsData,
			})

			const reply = `
Оберіть ${teamsQuantity}-х капітанів

<b>Капітани:</b>
${Object.keys(teamsData).join('. \n')}`

			const buttons = Markup.inlineKeyboard([[RANDOM_CAPTAINS_BUTTON], ...getPlayersButtons(players)])

			await ctx.replyWithHTML(reply, buttons)

			return
		}
		if (splitVariant === SKILL_SPLIT) teamsData = splitHandlers.handleSkillSplit(teamsData, players)
		if (splitVariant === RANDOM_SPLIT) teamsData = splitHandlers.handleRandomSplit(teamsData, players)

		await updateStore(ctx, { teamsData })

		await sendFinalReply(ctx, { splitVariant, teamsQuantity, teamsData })
	} catch (err) {
		await handleError({ ctx, err })
	}
}
