const getRandomFromArray = require('../../helpers/get-random-from-array')

module.exports = function handleOneTeamRandomSplit(players) {
	const list = []

	const remainedPlayers = [...players]

	for (let i = 1; i <= players.length; i++) {
		const chosenPlayer = getRandomFromArray(remainedPlayers)

		list.push(`${i}. ${chosenPlayer}`)

		remainedPlayers.splice(remainedPlayers.indexOf(chosenPlayer), 1)
	}

	return list
}
