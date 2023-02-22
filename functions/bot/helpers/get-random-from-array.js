const getRandomIndex = (min, max) => Math.floor(Math.random() * (max - min)) + min

const getRandomFromArray = arr => {
	const i = getRandomIndex(0, arr.length)
	return arr[i]
}

module.exports = getRandomFromArray
