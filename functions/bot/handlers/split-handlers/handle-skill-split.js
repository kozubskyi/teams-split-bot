const { store } = require('../../store');
const { getRandomFromArray } = require('../../helpers');

module.exports = function handleSkillSplit() {
  const teams = Object.keys(store.teamsData);

  let possibleTeams = [];

  store.players.forEach(player => {
    if (!possibleTeams.length) possibleTeams = [...teams];

    const chosenTeam = getRandomFromArray(possibleTeams);

    const count = store.teamsData[chosenTeam].length + 1;
    store.teamsData[chosenTeam].push(`${count}. ${player}`);

    possibleTeams = possibleTeams.filter(team => team !== chosenTeam);
  });
};
