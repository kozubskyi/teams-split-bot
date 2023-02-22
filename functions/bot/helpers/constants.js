const { KOZUBSKYI_CHAT_ID } = process.env

const constants = Object.freeze({
	CREATOR_USERNAME: 'kozubskyi',
	CREATOR_CHAT_ID: Number(KOZUBSKYI_CHAT_ID),

	PRIVATE_CHAT: 'private',
	GROUP_CHAT: 'group',
	SUPERGROUP_CHAT: 'supergroup',

	CAPTAINS_SPLIT: 'Капітанами',
	SKILL_SPLIT: 'За скілом',
	RANDOM_SPLIT: 'Рандомно',

	SPLIT_SYMBOLS: ['.', ')', '-'],

	STRAIGHT_SEQUENCE: 'straight',
	REVERSE_SEQUENCE: 'reverse',

	RANDOM_CAPTAINS: 'Обрати капітанів рандомно',
	CANCEL_LAST_CHOICE: 'Відмінити останній вибір',
	CHANGE_SEQUENCE: 'Змінити послідовність вибору',
	CHANGE_CAPTAINS: 'Переобрати капітанів',
	// RESPLIT_WITH_THE_CAPTAINS: 'Переділитися цими ж капітанами'

	SOMETHING_WENT_WRONG: '⚠️ Щось пішло не так, потрібно розпочати спочатку',

	DO_NOT_TOUCH_PLAYERS_BUTTONS: `<i>❗Інші користувачі чату не натискайте на кнопки гравців, тому що бот сприйме це як вибір капітана</i>`,
})

module.exports = constants
