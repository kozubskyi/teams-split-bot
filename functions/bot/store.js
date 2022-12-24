let store = {
  splitVariant: '',
  teamsQuantity: 0,
  players: [],
  captains: [],
  remainedPlayers: [],
  list: '',
  captainsChoice: '',
  teamsData: {},
  currentTeam: 0,
}

const resetStore = () => {
  store.splitVariant = ''
  store.teamsQuantity = 0
  store.players = []
  store.captains = []
  store.remainedPlayers = []
  store.list = ''
  store.captainsChoice = ''
  store.teamsData = {}
  store.currentTeam = 0
}

module.exports = {
  store,
  resetStore,
}
