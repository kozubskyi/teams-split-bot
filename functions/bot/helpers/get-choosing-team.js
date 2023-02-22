const getNextChoosingTeam = (currentTeam, teamsQuantity) => (currentTeam === teamsQuantity ? 1 : currentTeam + 1)
const getPrevChoosingTeam = (currentTeam, teamsQuantity) => (currentTeam === 1 ? teamsQuantity : currentTeam - 1)

module.exports = {
	getNextChoosingTeam,
	getPrevChoosingTeam,
}
