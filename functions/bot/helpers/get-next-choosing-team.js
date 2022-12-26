const { store } = require('../store');

module.exports = function getNextChoosingTeam() {
  if (store.currentTeam === store.teamsQuantity) return 1;
  else return store.currentTeam + 1;
}