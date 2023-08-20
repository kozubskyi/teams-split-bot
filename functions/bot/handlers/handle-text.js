const { Markup } = require('telegraf')
const { handleChat } = require('../services/chats-api')
const { getStore, updateStore } = require('../services/stores-api')
const handlePlayersList = require('./sub-handlers/handle-players-list')
const splitHandlers = require('./split-handlers')
const getPlayersButtons = require('../helpers/get-players-buttons')
const sendFinalReply = require('../helpers/send-final-reply')
const handleError = require('./handle-error')
const { CAPTAINS_SPLIT, SKILL_SPLIT, RANDOM_SPLIT, CREATOR_CHAT_ID } = require('../helpers/constants')
const { RANDOM_CAPTAINS_BUTTON } = require('../helpers/buttons')
const sendInfoMessageToCreator = require('../helpers/send-info-message-to-creator')

module.exports = async function handleText(ctx) {
	try {
		await handleChat(ctx)
		const chatId = ctx.chat.id
		let { splitVariant, teamsQuantity, players, captains, teamsData } = await getStore(chatId)

		if (!splitVariant || !teamsQuantity || players.length) return

		const playersList = ctx.message.text.split('\n')
		const playersQuantity = playersList.length

		if (playersQuantity < teamsQuantity) {
			await ctx.reply(
				`Потрібно вказати не менше ${teamsQuantity}-х гравців, а вказано ${playersQuantity}, спробуйте ще. Кожний наступний гравець повинен бути вказаний з нового рядка.`
			)
			return
		}

		players = handlePlayersList(playersList)

		await sendInfoMessageToCreator(ctx, 'playersList')

		if (playersQuantity === teamsQuantity) {
			teamsData = splitHandlers.handlePlayersQuantityEqualToTeamsQuantity(teamsData, players, splitVariant)

			await sendFinalReply(ctx, { splitVariant, teamsQuantity, teamsData })
			return
		}

		if (splitVariant === CAPTAINS_SPLIT) {
			await updateStore(ctx, { players, remainedPlayers: players })

			const reply = `
Оберіть ${teamsQuantity}-х капітанів. Послідовність я оберу самостійно випадковим чином.

<b>Капітани:</b>
${Object.keys(teamsData)
	.map((team, i) => (captains[i] ? `${team}. ${captains[i]}` : `${team}. `))
	.join('\n')}`

			const buttons = Markup.inlineKeyboard([[RANDOM_CAPTAINS_BUTTON], ...getPlayersButtons(players)])

			await ctx.replyWithHTML(reply, buttons)
			return
		}
		if (splitVariant === SKILL_SPLIT) teamsData = splitHandlers.handleSkillSplit(teamsData, players)
		if (splitVariant === RANDOM_SPLIT) teamsData = splitHandlers.handleRandomSplit(teamsData, players)

		// await updateStore(ctx, { players, teamsData })

		await sendFinalReply(ctx, { splitVariant, teamsQuantity, teamsData })
	} catch (err) {
		await handleError({ ctx, err })
	}
}
