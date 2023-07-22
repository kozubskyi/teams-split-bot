const axios = require('axios')
const getFields = require('../helpers/get-fields')

axios.defaults.baseURL = process.env.TELEGRAM_DB_BASE_URL

const createChat = async chatData => {
	const { data } = await axios.post('/chats', chatData)
	return data
}

const updateChat = async chatData => {
	const { data } = await axios.patch(`/chats/chatId/${chatData.chatId}`, chatData)
	return data
}

exports.handleChat = async ctx => {
	const fields = getFields(ctx)

	const createdChat = await createChat(fields)

	if (!createdChat) {
		await updateChat(fields)
	}
}
