module.exports = function getButtonText(buttonValue) {
  const buttons = {
    skill_split: 'За скілом',
    random_split: 'Рандомно',
    captains_split: 'Капітанами',
  }

  return buttons[buttonValue]
}
