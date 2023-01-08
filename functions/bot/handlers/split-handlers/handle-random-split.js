const { store } = require('../../store')
const { getRandomFromArray } = require('../../helpers')

module.exports = function handleRandomSplit() {
	const playersQuantity = store.players.length
	store.remainedPlayers = [...store.players]
	const teams = Object.keys(store.teamsData)

	let possibleTeams = []

	// for (let i = 0; i < store.players.length; i++) {
	//   if (!possibleTeams.length) possibleTeams = [...teams]

	//   const chosenPlayer = getRandomFromArray(store.remainedPlayers)

	//   store.teamsData[possibleTeams[0]].push(chosenPlayer)

	//   store.remainedPlayers = store.remainedPlayers.filter((player) => player !== chosenPlayer)
	//   possibleTeams.shift()
	// }

	let teamSlots = []

	for (let i = 0; i < playersQuantity; i++) {
		if (!possibleTeams.length) possibleTeams = [...teams]

		const chosenTeam = getRandomFromArray(possibleTeams)

		teamSlots.push(chosenTeam)

		possibleTeams = possibleTeams.filter(team => team !== chosenTeam)
	}

	for (let i = 0; i < playersQuantity; i++) {
		const chosenPlayer = getRandomFromArray(store.remainedPlayers)
		const chosenTeam = getRandomFromArray(teamSlots)

		const count = store.teamsData[chosenTeam].length + 1
		store.teamsData[chosenTeam].push(`${count}. ${chosenPlayer}`)

		store.remainedPlayers.splice(store.remainedPlayers.indexOf(chosenPlayer), 1)
		teamSlots.splice(teamSlots.indexOf(chosenTeam), 1)
	}
}
