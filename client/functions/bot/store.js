let store = {
  splitVariant: '',
  splitVariantChooser: '',
  teamsQuantity: 0,
  teamsQuantityChooser: '',
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
  store.splitVariantChooser = '';
  store.teamsQuantity = 0;
  store.teamsQuantityChooser = '';
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
