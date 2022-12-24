const { store } = require('../../store')
const getRandomFromArray = require('../../helpers/get-random-from-array')

module.exports = function handleRandomSplit() {
  const playersQuantity = store.players.length
  const teams = Object.keys(store.teamsData)

  let possibleTeams = []
  let teamSlots = []

  for (let i = 0; i < playersQuantity; i++) {
    if (!possibleTeams.length) possibleTeams = [...teams]

    const chosenTeam = getRandomFromArray(possibleTeams)

    teamSlots.push(chosenTeam)

    possibleTeams = possibleTeams.filter((team) => team !== chosenTeam)
  }

  store.remainedPlayers = [...store.players]

  for (let i = 0; i < playersQuantity; i++) {
    const chosenPlayer = getRandomFromArray(store.remainedPlayers)
    const chosenTeam = getRandomFromArray(teamSlots)

    store.teamsData[chosenTeam].push(chosenPlayer)

    store.remainedPlayers = store.remainedPlayers.filter((player) => player !== chosenPlayer)
    teamSlots.splice(teamSlots.indexOf(chosenTeam), 1)
  }
}
