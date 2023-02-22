const getRandomFromArray = require('../../helpers/get-random-from-array')

module.exports = function handleRandomSplit(teamsData, players) {
	const teams = Object.keys(teamsData)

	let remainedTeams = []
	const remainedPlayers = [...players]

	for (let i = 0; i < players.length; i++) {
		if (!remainedTeams.length) remainedTeams = [...teams]

		const chosenTeam = getRandomFromArray(remainedTeams)
		const chosenPlayer = getRandomFromArray(remainedPlayers)

		const count = teamsData[chosenTeam].length + 1
		teamsData[chosenTeam].push(`${count}. ${chosenPlayer}`)

		remainedTeams = remainedTeams.filter(team => team !== chosenTeam)
		remainedPlayers.splice(remainedPlayers.indexOf(chosenPlayer), 1)
	}

	return teamsData
}
