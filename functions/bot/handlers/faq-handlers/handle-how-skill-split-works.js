const { Markup } = require('telegraf')
const deleteMessage = require('../../helpers/delete-message')
const { handleChat } = require('../../services/chats-api')
const handleError = require('../handle-error')
const { HOW_SKILL_SPLIT_WORKS } = require('../../helpers/constants')
const { BACK_TO_QUESTIONS_BUTTON } = require('../../helpers/buttons')

module.exports = async function handleHowSkillSplitWorks(ctx) {
	try {
		await deleteMessage(ctx)
		await handleChat(ctx)

		const reply = `
<b>${HOW_SKILL_SPLIT_WORKS}</b>

При варіанті розподілу "За скілом" бот умовно ділить гравців на декілька корзин і потім по черзі, починаючи з першої корзини, випадковим чином розкидує гравців у команди.

Наприклад у нас є список з 15 гравців, складений від найсильнішого до найслабшого гравця, і поділ на 3 команди. Тоді перші три гравці (1-3) будуть поділені у різні команди випадковим чином. Потім наступні три (4-6) за тим же принципом і так далі до кінця списку (7-9, 10-12, 13-15) поки всі гравці не будуть розподілені у команди.`
    
		const buttons = Markup.inlineKeyboard([[BACK_TO_QUESTIONS_BUTTON]])

		await ctx.replyWithHTML(reply, buttons)
	} catch (err) {
		await handleError({ ctx, err })
	}
}
