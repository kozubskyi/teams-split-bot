const { Markup } = require('telegraf')
const { handleChat } = require('../../services/chats-api')
const { handleStore } = require('../../services/stores-api')
const deleteMessage = require('../../helpers/delete-message')
const handleError = require('../handle-error')
const { HOW_RANDOM_WORKS } = require('../../helpers/constants')
const { BACK_TO_QUESTIONS_BUTTON } = require('../../helpers/buttons')

module.exports = async function handleHowRandomWorksQuestion(ctx) {
	try {
		await handleChat(ctx)
		await handleStore(ctx.chat.id)
		await deleteMessage(ctx)

		const reply = `
<b>${HOW_RANDOM_WORKS}</b>

Бот написаний на мові програмування JavaScript, в якій є вбудований функціонал генерації випадкового числа у заданому діапазоні. На основі цього функціоналу реалізовано рандомний вибір гравця зі списку гравців.

Бот не запам'ятовує та не використовує минулі розподіли, послідовність чи будь-що інше, що може вплинути на поточний рандомний вибір. Іноді може здаватися, що бот наче бере до уваги минулі розподіли, але це лише так здається через малу вирібку.

Рандом використовується при варіантах розподілу "За скілом", "Рандомно", випадковому обранні капітанів та при обранні послідовності набору гравців у варіанті розподілу "Капітанами".`

		// Бот написаний на мові програмування JavaScript, в якій є вбудований функціонал генерації випадкового числа у заданому діапазоні. Кожен гравець списку відповідає певному числу (наприклад 15 гравців - числа від 1 до 15). Під час вашого кліка на кнопку, або відправки повідомлення, запускається необхідна кількість викликів функції, яка кожен раз генерує випадкове число (наприклад 3, 12, 7, 1, 4, ...), і, відповідно, кожен раз обирається гравець, що відповідає даному числу.

		const buttons = Markup.inlineKeyboard([[BACK_TO_QUESTIONS_BUTTON]])

		await ctx.replyWithHTML(reply, buttons)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
