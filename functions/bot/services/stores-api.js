const axios = require('axios')
const getFields = require('../helpers/get-fields')

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

const createStore = async storeData => {
	const { data } = await axios.post('/stores', storeData)
	return data
}

const resetStore = async ctx => {
	const fields = getFields(ctx)

	const { data } = await axios.patch(`/stores/chatId/${fields.chatId}`, { ...fields, ...initialStore })

	return data
}

exports.resetStore = resetStore

exports.getStore = async chatId => {
	const { data } = await axios.get(`/stores/chatId/${chatId}`)
	return data
}

exports.updateStore = async (ctx, updatedFields) => {
	const fields = getFields(ctx)

	const { data } = await axios.patch(`/stores/chatId/${fields.chatId}`, { ...fields, ...updatedFields })
	return data
}

exports.handleStore = async ctx => {
	const fields = getFields(ctx)

	const createdStore = await createStore(fields)

	if (!createdStore) {
		await resetStore(ctx)
	}
}
