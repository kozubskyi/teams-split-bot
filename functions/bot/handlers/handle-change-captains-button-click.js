const { store } = require('../store')
const handleError = require('./handle-error')
const { handlePlayers } = require('./text-handlers')

module.exports = async function handleChangeCaptainsButtonClick(ctx) {
  try {
    if (!store.splitVariant || !store.teamsQuantity || !store.players.length) return

    store.captains = []
    store.remainedPlayers = []
    store.remainedCaptains = []
    store.captainsChoice = ''
    for (let i = 1; i <= store.teamsQuantity; i++) store.teamsData[i] = []
    store.currentTeam = 0
    store.lastChosenPlayer = ''

    await handlePlayers(ctx)
  } catch (err) {
    await handleError(err, ctx)
  }
}
