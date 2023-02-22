const axios = require('axios')
const { PRIVATE_CHAT, GROUP_CHAT, SUPERGROUP_CHAT } = require('../helpers/constants')

axios.defaults.baseURL = process.env.TELEGRAM_DB_BASE_URL

const createChat = async chatData => {
	const { data } = await axios.post('/chats', chatData)
	return data
}

const updateChat = async (chatId, updatedFields) => {
	const { data } = await axios.patch(`/chats/chatId/${chatId}`, updatedFields)
	return data
}

exports.handleChat = async ctx => {
	const type = ctx.chat?.type
	const chatId = ctx.chat?.id
	const userChatId = ctx.from?.id
	const first_name = ctx.from?.first_name
	const last_name = ctx.from?.last_name
	const username = ctx.from?.username
	const title = ctx.chat?.title

	let updatedFields = {}

	if (type === PRIVATE_CHAT) {
		updatedFields = { first_name, last_name, username }
	}
	if (type === GROUP_CHAT || type === SUPERGROUP_CHAT) {
		updatedFields = { title }
	}

	const createdChat = await createChat({ chatId, type, ...updatedFields })

	if (!createdChat) {
		await updateChat(chatId, updatedFields)
	}
}
