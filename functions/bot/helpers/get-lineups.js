const { TEAM_COLORS } = require('./constants')

module.exports = function getLineups(teamsData, teamRatings) {
	const teams = Object.keys(teamsData)

	if (teams.length === 1) {
		return `\n${teamsData['1'].join('\n')}`
	} else {
		return `
${teams
	.map((team, i) => {
		return `
<b>${TEAM_COLORS[i]} Команда ${team}${teamRatings ? ` [=${teamRatings[team]}]` : ''}:</b>
${teamsData[team].join('\n')}
`
	})
	.join('')}
`
	}
}
