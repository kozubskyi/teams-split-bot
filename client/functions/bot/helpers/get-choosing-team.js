const { store } = require('../store')

const getNextChoosingTeam = () => (store.currentTeam === store.teamsQuantity ? 1 : store.currentTeam + 1)
const getPrevChoosingTeam = () => (store.currentTeam === 1 ? store.teamsQuantity : store.currentTeam - 1)

module.exports = {
	getNextChoosingTeam,
	getPrevChoosingTeam
}
