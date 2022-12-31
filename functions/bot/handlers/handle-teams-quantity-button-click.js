const { store, resetStore } = require('../store');
const { replies, buttons, getButtonText } = require('../helpers');
const handleError = require('./handle-error');

module.exports = async function handleTeamsQuantityButtonClick(ctx) {
  try {
    if (!store.splitVariant) return;
    // if (!store.splitVariant) return await ctx.reply(replies.firstChooseSplitVariantReply, buttons.splitVariantButtons)

    const { first_name, last_name } = ctx.callbackQuery.from;
    store.teamsQuantity = Number(ctx.callbackQuery.data[0]);
    store.teamsQuantityChooser = `${first_name}${last_name ? ` ${last_name}` : ''}`;
    store.list = 'players';

    for (let i = 1; i <= store.teamsQuantity; i++) store.teamsData[i] = [];

    let reply = 'Відправте список гравців де кожний наступний гравець вказаний з нового рядка';

    if (store.splitVariantChooser === store.teamsQuantityChooser) {
      reply = `
<i>ℹ️ ${
        store.splitVariantChooser
      } обрав варіант розподілу "${getButtonText()}" та кількість команд "${
        store.teamsQuantity
      }"</i>

${reply}
`;
    } else {
      reply = `
<i>ℹ️ ${store.splitVariantChooser} обрав варіант розподілу "${getButtonText()}", а ${
        store.teamsQuantityChooser
      } обрав кількість команд "${store.teamsQuantity}"</i>

${reply}
`;
    }

    if (store.splitVariant === 'skill_split') {
      reply = `
${reply}
<i>❗Ви обрали розподіл "За скілом", тому обов'язково потрібно відправити список гравців, сформований від найкращого до найгіршого гравця (на вашу суб'єктивну думку)</i>
`;
    }

    await ctx.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message.message_id);
    await ctx.replyWithHTML(reply);
  } catch (err) {
    await handleError(err, ctx);
  }
};
