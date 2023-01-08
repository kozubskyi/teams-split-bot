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
  sequense: 'straight',
  currentTeam: 1,
  lastChosenPlayer: '',
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
  store.sequense = 'straight';
  store.currentTeam = 1;
  store.lastChosenPlayer = '';
};

module.exports = {
  store,
  resetStore,
};
