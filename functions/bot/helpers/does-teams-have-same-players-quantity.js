const { store } = require('../store');

module.exports = function doseTeamsHaveSamePlayersQuantity() {
  for (let i = 2; i <= store.teamsQuantity; i++) {
    if (store.teamsData[i].length !== store.teamsData[1].length) return false;
  }
  return true;
};
