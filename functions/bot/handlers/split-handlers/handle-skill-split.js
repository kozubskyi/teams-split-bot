const { store } = require('../../store')
const getRandomFromArray = require('../../helpers/get-random-from-array')

module.exports = function handleSkillSplit() {
  const teams = Object.keys(store.teamsData)

  let possibleTeams = []

  store.players.forEach((player) => {
    if (!possibleTeams.length) possibleTeams = [...teams]

    const chosenTeam = getRandomFromArray(possibleTeams)

    store.teamsData[chosenTeam].push(player)

    possibleTeams = possibleTeams.filter((team) => team !== chosenTeam)
    // possibleTeams.splice(possibleTeams.indexOf(chosenTeam), 1)
  })
}
