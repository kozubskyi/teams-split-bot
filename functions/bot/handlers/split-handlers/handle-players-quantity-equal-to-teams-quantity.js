const getRandomFromArray = require('../../helpers/get-random-from-array')
const { CAPTAINS_SPLIT } = require('../../helpers/constants')

module.exports = function handlePlayersQuantityEqualToTeamsQuantity(teamsData, players, splitVariant) {
	let teams = Object.keys(teamsData)
	const teamsQuantity = teams.length

	const remainedPlayers = [...players]

	for (let i = 0; i < teamsQuantity; i++) {
		const chosenTeam = getRandomFromArray(teams)
		const chosenPlayer = getRandomFromArray(remainedPlayers)
		const player = splitVariant === CAPTAINS_SPLIT ? `1. ${chosenPlayer} (C)` : `1. ${chosenPlayer}`

		teamsData[chosenTeam].push(player)

		teams = teams.filter(team => team !== chosenTeam)
		remainedPlayers.splice(remainedPlayers.indexOf(chosenPlayer), 1)
	}

	return teamsData
}
