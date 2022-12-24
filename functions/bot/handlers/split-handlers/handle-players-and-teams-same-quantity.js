const { store } = require('../../store')
const getRandomFromArray = require('../../helpers/get-random-from-array')

module.exports = function handlePlayersAndTeamsSameQuantity() {
  store.remainedPlayers = [...store.players]

  let teams = Object.keys(store.teamsData)

  store.remainedPlayers.forEach((player) => {
    const chosenTeam = getRandomFromArray(teams)

    store.teamsData[chosenTeam].push(player)

    store.remainedPlayers = store.remainedPlayers.filter((remainedPlayer) => remainedPlayer !== player)
    teams = teams.filter((team) => team !== chosenTeam)
  })
}
