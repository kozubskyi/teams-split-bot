const deleteMessage = require('../../helpers/delete-message')
const { handleChat } = require('../../services/chats-api')
const handleFAQCommand = require('../handle-faq-command')
const handleError = require('../handle-error')

module.exports = async function handleBackToQuestionsButtonClick(ctx) {
	try {
		await deleteMessage(ctx)
		await handleChat(ctx)
		await handleFAQCommand(ctx)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
