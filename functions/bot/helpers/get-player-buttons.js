const { Markup } = require('telegraf')

module.exports = function getPlayerButtons(players, buttonsInString = 2) {
  const buttons = []
  let currentIndex = 0

  players.forEach((player) => {
    const playerButton = Markup.button.callback(player, player)

    buttons[currentIndex] = buttons[currentIndex] ?? []

    if (buttons[currentIndex].length < buttonsInString) {
      buttons[currentIndex].push(playerButton)
    } else {
      currentIndex++
      buttons[currentIndex] = [playerButton]
    }
  })

  for (let i = buttons[currentIndex].length; i < buttonsInString; i++) {
    buttons[currentIndex].push(Markup.button.callback('-', '-'))
  }

  return Markup.inlineKeyboard(buttons)
}
