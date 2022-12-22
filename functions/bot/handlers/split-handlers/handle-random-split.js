const getRandomFromArray = require('../../helpers/get-random-from-array')

module.exports = (players, teamsData) => {
  const playersCopy = [...players]
  const teamsDataCopy = JSON.parse(JSON.stringify(teamsData))
  const playersQuantity = players.length
  const teams = Object.keys(teamsDataCopy)

  let possibleTeams = [...teams]
  let teamSlots = []

  for (let i = 0; i < playersQuantity; i++) {
    if (!possibleTeams.length) possibleTeams = [...teams]

    const chosenTeam = getRandomFromArray(possibleTeams)

    teamSlots.push(chosenTeam)

    possibleTeams = possibleTeams.filter((team) => team !== chosenTeam)
  }

  for (let i = 0; i < playersQuantity; i++) {
    const chosenPlayer = getRandomFromArray(playersCopy)
    const chosenTeam = getRandomFromArray(teamSlots)

    teamsDataCopy[chosenTeam].push(chosenPlayer)

    playersCopy.splice(playersCopy.indexOf(chosenPlayer), 1)
    teamSlots.splice(teamSlots.indexOf(chosenTeam), 1)
  }

  return teamsDataCopy
}
