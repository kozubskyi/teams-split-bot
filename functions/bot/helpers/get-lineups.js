const { store } = require('../store')

module.exports = function getLineups() {
  return `
${Object.keys(store.teamsData)
  .map((teamName) => {
    return `
<b>Команда ${teamName}:</b>
${store.teamsData[teamName].join('\n')}
`
  })
  .join('')}
`
}
