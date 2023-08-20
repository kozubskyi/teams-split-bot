const { handleChat } = require('../services/chats-api')
const { getStore } = require('../services/stores-api')
const getLineups = require('../helpers/get-lineups')
const handleError = require('./handle-error')

module.exports = async function handleTeamRatingsCommand(ctx) {
	try {
		await handleChat(ctx)
		const { splitVariant, teamsQuantity, players, teamsData } = await getStore(ctx.chat.id)

		const teamsDataPlayersQuantity = teamsData ? Object.values(teamsData).flatMap(arr => arr).length : 0

		if (players.length === 0 || teamsDataPlayersQuantity !== players.length)
			return await ctx.reply('Спочатку треба поділити команди')

		const playersCopy = [...players]
		const teamRatings = {}
		for (let team = 1; team <= teamsQuantity; team++) teamRatings[team] = 0

		Object.keys(teamsData).forEach(team => {
			teamsData[team] = teamsData[team].map(playerString => {
				const player = playerString.slice(3).replace('(C)', '').trim()

				const playerIndex = playersCopy.indexOf(player)
				playersCopy[playerIndex] = null

				const points = players.length - playerIndex
				teamRatings[team] += points

				return `${playerString} [+${points}]`
			})
		})

		const reply = `<i>❗Рейтинги коректні тільки якщо список гравців був сформований від найкращого до найгіршого гравця.</i> ${getLineups(
			teamsData,
			teamRatings
		)}`

		await ctx.replyWithHTML(reply)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
