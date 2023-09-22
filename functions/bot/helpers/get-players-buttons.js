const { Markup } = require('telegraf')

module.exports = function getPlayersButtons(players, buttonsInString = 3) {
	const buttons = []
	let currentIndex = 0

	players.forEach(player => {
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

	return buttons
}
