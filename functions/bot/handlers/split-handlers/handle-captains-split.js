const { store } = require('../../store')
const getRandomFromArray = require('../../helpers/get-random-from-array')

module.exports = function handleCaptainsSplit() {
  store.remainedPlayers = store.players.filter((player) => !store.captains.includes(player))

  let teams = Object.keys(store.teamsData)

  store.captains.forEach((player) => {
    const chosenTeam = getRandomFromArray(teams)

    store.teamsData[chosenTeam].push(`${player} (C)`)

    teams = teams.filter((team) => team !== chosenTeam)
  })
}
