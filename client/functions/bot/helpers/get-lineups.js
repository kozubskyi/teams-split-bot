const { store } = require('../store')

module.exports = function getLineups() {
	return `
${Object.keys(store.teamsData)
	.map(team => {
		return `
<b>Команда ${team}:</b>
${store.teamsData[team].join('\n')}
`
	})
	.join('')}
`
}
