const { store } = require('../store')

module.exports = function getButtonText() {
  const buttons = {
    skill_split: 'За скілом',
    random_split: 'Рандомно',
    captains_split: 'Капітанами',
  }

  return buttons[store.splitVariant]
}
