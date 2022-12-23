const { Markup } = require('telegraf')

module.exports = {
  splitVariantButtons: Markup.inlineKeyboard([
    [Markup.button.callback('💪 За скілом', 'skill_split'), Markup.button.callback('🎲 Рандомно', 'random_split')],
    [Markup.button.callback('👥 Капітанами', 'captains_split')],
  ]),
  teamsQuantityButtons: Markup.inlineKeyboard([
    [
      Markup.button.callback('2', '2_teams'),
      Markup.button.callback('3', '3_teams'),
      Markup.button.callback('4', '4_teams'),
    ],
  ]),
}
