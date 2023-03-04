const { TEAM_COLORS } = require('./constants')

module.exports = function getLineups(teamsData) {
	return `
${Object.keys(teamsData)
	.map((team, i) => {
		return `
<b>${TEAM_COLORS[i]} Команда ${team}:</b>
${teamsData[team].join('\n')}
`
	})
	.join('')}
`
}
