const getRandomFromArray = require('../../helpers/get-random-from-array')

module.exports = (players, teamsData) => {
  const playersCopy = [...players]
  const teamsDataCopy = JSON.parse(JSON.stringify(teamsData))
  const teams = Object.keys(teamsDataCopy)

  let possibleTeams = []

  playersCopy.forEach((player) => {
    if (!possibleTeams.length) possibleTeams = [...teams]

    const chosenTeam = getRandomFromArray(possibleTeams)

    teamsDataCopy[chosenTeam].push(player)

    possibleTeams.splice(possibleTeams.indexOf(chosenTeam), 1)
  })

  return teamsDataCopy
}
