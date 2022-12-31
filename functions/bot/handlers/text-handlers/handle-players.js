const { store, resetStore } = require('../../store');
const helpers = require('../../helpers');
const splitHandlers = require('../split-handlers');

module.exports = async function handlePlayers(ctx) {
  if (store.players.length < store.teamsQuantity) {
    await ctx.reply(
      `Потрібно вказати не менше ${store.teamsQuantity}-х гравців, а вказано ${store.players.length}, спробуйте ще. Кожний наступний гравець повинен бути вказаний з нового рядка.`
    );
    store.players = [];
    return;
  }
  if (store.players.length === store.teamsQuantity) {
    store.remainedPlayers = [...store.players];

    let teams = Object.keys(store.teamsData);

    for (let i = 0; i < store.teamsQuantity; i++) {
      const chosenTeam = helpers.getRandomFromArray(teams);
      const chosenPlayer = helpers.getRandomFromArray(store.remainedPlayers);
      const player =
        store.splitVariant === 'captains_split' ? `1. ${chosenPlayer} (C)` : `1. ${chosenPlayer}`;

      store.teamsData[chosenTeam].push(player);

      teams = teams.filter(team => team !== chosenTeam);
      store.remainedPlayers.splice(store.remainedPlayers.indexOf(chosenPlayer), 1);
    }

    helpers.sendFinalReply(ctx);
    return;
  }

  if (store.splitVariant === 'captains_split') {
    await ctx.reply(
      `Натисність на кнопку нижче і я самостійно випадковим чином оберу капітанів зі списку гравців, або відправте список з ${store.teamsQuantity}-х капітанів.`,
      helpers.buttons.randomCaptainsButton
    );

    // await ctx.reply(`Як оберемо капітанів?`, helpers.buttons.captainsChoosingButtons);

    store.list = 'captains';
    return;
  }
  if (store.splitVariant === 'skill_split') splitHandlers.handleSkillSplit();
  if (store.splitVariant === 'random_split') splitHandlers.handleRandomSplit();

  helpers.sendFinalReply(ctx);
};
