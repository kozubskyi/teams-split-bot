const { Markup } = require('telegraf')
const {
	CAPTAINS_SPLIT,
	SKILL_SPLIT,
	RANDOM_SPLIT,
	RANDOM_CAPTAINS,
	CANCEL_LAST_CHOICE,
	CHANGE_SEQUENCE,
	CHANGE_CAPTAINS,
	BACK_TO_QUESTIONS,
} = require('./constants')

const buttons = Object.freeze({
	CAPTAINS_SPLIT_BUTTON: Markup.button.callback(`đĨ ${CAPTAINS_SPLIT}`, CAPTAINS_SPLIT),
	SKILL_SPLIT_BUTTON: Markup.button.callback(`đĒ ${SKILL_SPLIT}`, SKILL_SPLIT),
	RANDOM_SPLIT_BUTTON: Markup.button.callback(`đ˛ ${RANDOM_SPLIT}`, RANDOM_SPLIT),

	RANDOM_CAPTAINS_BUTTON: Markup.button.callback(`đ ${RANDOM_CAPTAINS}`, RANDOM_CAPTAINS),
	CANCEL_LAST_CHOICE_BUTTON: Markup.button.callback(`â ${CANCEL_LAST_CHOICE}`, CANCEL_LAST_CHOICE), // ââī¸đĢâ
	CHANGE_SEQUENCE_BUTTON: Markup.button.callback(`đ ${CHANGE_SEQUENCE}`, CHANGE_SEQUENCE), // âŠī¸đđ
	CHANGE_CAPTAINS_BUTTON: Markup.button.callback(`ÂŠī¸ ${CHANGE_CAPTAINS}`, CHANGE_CAPTAINS), // ÂŠī¸â­ī¸đ¨ââī¸đĨ
	// RESPLIT_WITH_THE_CAPTAINS_BUTTON: Markup.button.callback(`ÂŠī¸ ${RESPLIT_WITH_THE_CAPTAINS}`, RESPLIT_WITH_THE_CAPTAINS), // ÂŠī¸âŽâĒâī¸âŦī¸đđđ

	BACK_TO_QUESTIONS_BUTTON: Markup.button.callback(BACK_TO_QUESTIONS, BACK_TO_QUESTIONS),
})

module.exports = buttons
