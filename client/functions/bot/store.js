let store = {
  splitVariant: '',
  teamsQuantity: 0,
  players: [],
  captains: [],
  remainedPlayers: [],
  remainedCaptains: [],
  list: '',
  captainsChoice: '',
  teamsData: {},
  sequence: 'straight',
  currentTeam: 1,
  lastChosenPlayers: [],
};

const resetStore = () => {
  store.splitVariant = '';
  store.teamsQuantity = 0;
  store.players = [];
  store.captains = [];
  store.remainedPlayers = [];
  store.remainedCaptains = [];
  store.list = '';
  store.captainsChoice = '';
  store.teamsData = {};
  store.sequence = 'straight';
  store.currentTeam = 1;
  store.lastChosenPlayers = [];
};

module.exports = {
  store,
  resetStore,
};
