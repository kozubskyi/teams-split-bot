const { store } = require('../store');

function getNextChoosingTeam() {
  if (store.currentTeam === store.teamsQuantity) return 1;
  else return store.currentTeam + 1;
}

function getPrevChoosingTeam() {
  if (store.currentTeam <= 1) return store.teamsQuantity;
  else return store.currentTeam - 1;
}

module.exports = {
  getNextChoosingTeam,
  getPrevChoosingTeam,
};
