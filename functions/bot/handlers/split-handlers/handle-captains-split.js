const getRandomFromArray = require('../../helpers/get-random-from-array')

module.exports = (players, teamsData) => {
  const playersCopy = [...players]
  const teams = Object.keys(teamsData)

  let possibleTeams = []

  playersCopy.forEach((player) => {
    if (!possibleTeams.length) possibleTeams = [...teams]

    const chosenTeam = getRandomFromArray(possibleTeams)

    teamsData[chosenTeam].push(player)

    possibleTeams.splice(possibleTeams.indexOf(chosenTeam), 1)
  })

  return teamsData
}
