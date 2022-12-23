module.exports = function getButtonText(buttonValue) {
  const buttons = {
    skill_split: 'За скілом',
    random_split: 'Рандомно',
    captains_split: 'Капітанами',
    '2_teams': '2',
    '3_teams': '3',
    '4_teams': '4',
  }

  return buttons[buttonValue]
}
