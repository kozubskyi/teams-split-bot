const { Markup } = require('telegraf')

module.exports = {
	splitVariantButtons: [
		[Markup.button.callback('👥 Капітанами', 'captains_split')],
		[Markup.button.callback('💪 За скілом', 'skill_split'), Markup.button.callback('🎲 Рандомно', 'random_split')]
	],
	teamsQuantityButtons: [
		[
			Markup.button.callback('2', '2_teams'),
			Markup.button.callback('3', '3_teams'),
			Markup.button.callback('4', '4_teams')
		]
	],
	randomCaptainsButton: [Markup.button.callback('Обрати капітанів рандомно', 'random_captains')],
	cancelLastChosenPlayerButton: [Markup.button.callback('✖️ Відмінити останній вибір', 'cancel_last_chosen_player')], // ❌✖️🚫❎
	changeSequenceButton: [Markup.button.callback('🔙 Змінити послідовність вибору', 'change_sequence')], // ↩️🔙
	resplitButton: [Markup.button.callback('🔝 Переділитись цими капітанами', 'resplit_with_these_captains')], // ⏮⏪◀️⬅️🔚🔙🔝
	changeCaptainsButton: [Markup.button.callback('©️ Обрати інших капітанів', 'change_captains')] // ©️⭐️
}
