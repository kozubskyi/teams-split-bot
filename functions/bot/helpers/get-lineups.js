module.exports = function getLineups(teamsData) {
	return `
${Object.keys(teamsData)
	.map(team => {
		return `
<b>Команда ${team}:</b>
${teamsData[team].join('\n')}
`
	})
	.join('')}
`
}
