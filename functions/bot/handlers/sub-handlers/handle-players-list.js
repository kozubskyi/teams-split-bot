const { SPLIT_SYMBOLS } = require('../../helpers/constants')

module.exports = function handlePlayersList(playersList) {
	const players = playersList.map(playerString => {
		for (let i = 0; i < playerString.length; i++) {
			if (SPLIT_SYMBOLS.includes(playerString[i]) && !Number.isNaN(Number(playerString[i - 1]))) {
				playerString = playerString.replace(playerString[i], '~')
			}
		}
		const playerArray = playerString.split('~')
		return playerArray[playerArray.length - 1].trim()
	})

	return players
}
