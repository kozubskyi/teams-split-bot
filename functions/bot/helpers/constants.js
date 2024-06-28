const { KOZUBSKYI_CHAT_ID } = process.env

const constants = Object.freeze({
	CREATOR_USERNAME: 'kozubskyi',
	CREATOR_CHAT_ID: Number(KOZUBSKYI_CHAT_ID),

	PRIVATE_CHAT: 'private',
	GROUP_CHAT: 'group',

	CAPTAINS_SPLIT: 'Капітанами',
	SKILL_SPLIT: 'За скілом',
	RANDOM_SPLIT: 'Рандомно',

	ONE_TEAM: '1_team',
	TWO_TEAMS: '2_teams',
	THREE_TEAMS: '3_teams',
	FOUR_TEAMS: '4_teams',

	TEAM_COLORS: ['🟢', '🔴', '🔵', '🟡'], // 🟢🔴🔵🟣🟡🟠🟤⚪️⚫️
	SPLIT_SYMBOLS: ['.', ')', '-'],

	REMAIN_CAPTAINS_SELECTION_ORDER: 'REMAIN_CAPTAINS_SELECTION_ORDER',
	RANDOM_CAPTAINS_SELECTION_ORDER: 'RANDOM_CAPTAINS_SELECTION_ORDER',

	HOW_USE_BOT: 'Як користуватися ботом?',
	HOW_RANDOM_WORKS: 'Як працює рандом?',
	HOW_SKILL_SPLIT_WORKS: 'Як працює поділ "За скілом"?',
	BACK_TO_QUESTIONS: 'Повернутися до запитань',

	STRAIGHT_SEQUENCE: 'straight',
	REVERSE_SEQUENCE: 'reverse',

	RANDOM_CAPTAINS: 'Обрати капітанів рандомно',
	CANCEL_LAST_CHOICE: 'Відмінити останній вибір',
	CHANGE_SEQUENCE: 'Змінити послідовність вибору',
	CHANGE_CAPTAINS: 'Змінити капітанів',
	TRANSFERS: 'Трансфери',
	FINISH_TRANSFERS: 'Завершити трансфери',
	RESPLIT: 'Переділити',
	// RESPLIT_WITH_THE_CAPTAINS: 'Переділитися цими ж капітанами'

	SOMETHING_WENT_WRONG: '⚠️ Щось пішло не так, потрібно розпочати спочатку',

	DO_NOT_TOUCH_PLAYERS_BUTTONS: `<i>❗Інші користувачі чату не натискайте на кнопки гравців, тому що бот сприйме це як вибір капітана</i>`,
})

module.exports = constants
