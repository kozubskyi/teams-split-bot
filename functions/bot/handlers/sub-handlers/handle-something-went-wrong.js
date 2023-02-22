const handleStartCommand = require('../handle-start-command')
const { SOMETHING_WENT_WRONG } = require('../../helpers/constants')

module.exports = async function handleSomethingWentWrong(ctx) {
	await ctx.reply(SOMETHING_WENT_WRONG)
	await handleStartCommand(ctx)
}
