module.exports = (teamsData) => `
${Object.keys(teamsData)
  .map((teamName) => {
    return `
<b>Команда ${teamName}:</b>
${teamsData[teamName].join('\n')}
`
  })
  .join('')}
`
