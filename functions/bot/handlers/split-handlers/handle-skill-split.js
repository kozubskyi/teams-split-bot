const getRandomFromArray = require('../../helpers/get-random-from-array')

module.exports = function handleSkillSplit(teamsData, players) {
	const teams = Object.keys(teamsData)

	let possibleTeams = []

	players.forEach(player => {
		if (!possibleTeams.length) possibleTeams = [...teams]

		const chosenTeam = getRandomFromArray(possibleTeams)

		const count = teamsData[chosenTeam].length + 1
		teamsData[chosenTeam].push(`${count}. ${player}`)

		possibleTeams = possibleTeams.filter(team => team !== chosenTeam)
	})

	return teamsData
}
