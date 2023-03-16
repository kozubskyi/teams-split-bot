const { TEAM_COLORS } = require('./constants')

module.exports = function getLineups(teamsData, teamRatings) {
	return `
${Object.keys(teamsData)
	.map((team, i) => {
		return `
<b>${TEAM_COLORS[i]} Команда ${team}${teamRatings ? ` [=${teamRatings[team]}]` : ''}:</b>
${teamsData[team].join('\n')}
`
	})
	.join('')}
`
}
