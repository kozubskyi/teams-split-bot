const deleteMessage = require('../../helpers/delete-message')
const handleFAQCommand = require('../handle-faq-command')
const handleError = require('../handle-error')

module.exports = async function handleBackToQuestionsButtonClick(ctx) {
	try {
		await deleteMessage(ctx)
		await handleFAQCommand(ctx)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
