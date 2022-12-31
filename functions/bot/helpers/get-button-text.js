const { store } = require('../store');

module.exports = function getButtonText() {
  const buttons = {
    captains_split: 'Капітанами',
    skill_split: 'За скілом',
    random_split: 'Рандомно',
  };

  return buttons[store.splitVariant];
};
