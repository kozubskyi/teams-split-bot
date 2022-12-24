const { store, resetStore } = require('../store')
const helpers = require('../helpers')
const { buttons } = require('../helpers')
const textHandlers = require('./text-handlers')
const splitHandlers = require('./split-handlers')
const handleError = require('./handle-error')

module.exports = async function handleText(ctx) {
  try {
    if (!store.splitVariant || !store.teamsQuantity) return

    store[store.list] = ctx.message.text.split('\n')

    if (store.list === 'captains') {
      await textHandlers.handleCaptains(ctx)
    }
    if (store.list === 'players') {
      await textHandlers.handlePlayers(ctx)
    }
  } catch (err) {
    await handleError(err, ctx)
  }
}
