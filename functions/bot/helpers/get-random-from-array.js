const getRandomIndex = (min, max) => Math.floor(Math.random() * (max - min)) + min

module.exports = (arr) => {
  const i = getRandomIndex(0, arr.length)

  return arr[i]
}
