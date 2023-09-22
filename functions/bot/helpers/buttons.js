const { Markup } = require('telegraf')
const {
	CAPTAINS_SPLIT,
	SKILL_SPLIT,
	RANDOM_SPLIT,
	REMAIN_CAPTAINS_SELECTION_ORDER,
	RANDOM_CAPTAINS_SELECTION_ORDER,
	RANDOM_CAPTAINS,
	CANCEL_LAST_CHOICE,
	CHANGE_SEQUENCE,
	CHANGE_CAPTAINS,
	TRANSFERS,
	FINISH_TRANSFERS,
	BACK_TO_QUESTIONS,
} = require('./constants')

const buttons = Object.freeze({
	CAPTAINS_SPLIT_BUTTON: Markup.button.callback(`👥 ${CAPTAINS_SPLIT}`, CAPTAINS_SPLIT),
	SKILL_SPLIT_BUTTON: Markup.button.callback(`💪 ${SKILL_SPLIT}`, SKILL_SPLIT), // 📊💪
	RANDOM_SPLIT_BUTTON: Markup.button.callback(`🎲 ${RANDOM_SPLIT}`, RANDOM_SPLIT),

	REMAIN_CAPTAINS_SELECTION_ORDER_BUTTON: Markup.button.callback(`1️⃣2️⃣3️⃣`, REMAIN_CAPTAINS_SELECTION_ORDER),
	RANDOM_CAPTAINS_SELECTION_ORDER_BUTTON: Markup.button.callback(`🪨✂️📄`, RANDOM_CAPTAINS_SELECTION_ORDER),

	RANDOM_CAPTAINS_BUTTON: Markup.button.callback(RANDOM_CAPTAINS, RANDOM_CAPTAINS), // 👨‍✈️
	CANCEL_LAST_CHOICE_BUTTON: Markup.button.callback(`❌ ${CANCEL_LAST_CHOICE}`, CANCEL_LAST_CHOICE), // ❌✖️🚫❎
	CHANGE_SEQUENCE_BUTTON: Markup.button.callback(`🔙 ${CHANGE_SEQUENCE}`, CHANGE_SEQUENCE), // ↩️🔙🔀
	CHANGE_CAPTAINS_BUTTON: Markup.button.callback(`👨‍✈️ ${CHANGE_CAPTAINS}`, CHANGE_CAPTAINS), // ©️⭐️👨‍✈️👥
	TRANSFERS_BUTTON: Markup.button.callback(TRANSFERS, TRANSFERS),
	FINISH_TRANSFERS_BUTTON: Markup.button.callback(`☑️ ${FINISH_TRANSFERS}`, FINISH_TRANSFERS),
	// RESPLIT_WITH_THE_CAPTAINS_BUTTON: Markup.button.callback(`©️ ${RESPLIT_WITH_THE_CAPTAINS}`, RESPLIT_WITH_THE_CAPTAINS), // ©️⏮⏪◀️⬅️🔚🔙🔝

	BACK_TO_QUESTIONS_BUTTON: Markup.button.callback(BACK_TO_QUESTIONS, BACK_TO_QUESTIONS),
})

module.exports = buttons
