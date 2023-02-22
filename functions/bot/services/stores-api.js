const axios = require('axios')

axios.defaults.baseURL = process.env.TELEGRAM_DB_BASE_URL

const initialStore = {
	splitVariant: '',
	teamsQuantity: 0,
	players: [],
	captains: [],
	remainedPlayers: [],
	teamsData: {},
	captainsChoice: '',
	sequence: 'straight',
	currentTeam: 1,
	lastChosenPlayers: [],
}

const createStore = async chatId => {
	const { data } = await axios.post('/stores', { chatId })
	return data
}

const resetStore = async chatId => {
	const { data } = await axios.patch(`/stores/chatId/${chatId}`, initialStore)
	return data
}

exports.resetStore = resetStore

exports.getStore = async chatId => {
	const { data } = await axios.get(`/stores/chatId/${chatId}`)
	return data
}

exports.updateStore = async (chatId, updatedFields) => {
	const { data } = await axios.patch(`/stores/chatId/${chatId}`, updatedFields)
	return data
}

exports.handleStore = async chatId => {
	let store = await createStore(chatId)

	if (!store) {
		store = await resetStore(chatId)
	}

	return store
}
