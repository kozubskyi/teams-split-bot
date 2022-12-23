const { splitVariantButtons } = require('../helpers/buttons')
const handleError = require('./handle-error')

module.exports = async function handleStartCommand(ctx) {
  const reply = `
Я бот, що був створений для розподілу гравців на команди у командних видах спорту. Вкажіть як ви хочете, щоб відбувся розподіл:

<b>За скілом</b> - гравці будуть поділені на команди, враховуючи індивідуальні навички кожного гравця. Для цього пізніше потрібно буде відправити список гравців, сформований від найкращого до найгіршого гравця (на вашу суб'єктивну думку).

<b>Рандомно</b> - гравці будуть поділені на команди випадковим чином, не зважаючи на індивідуальні навички кожного гравця.

<b>Капітанами</b> - кожен з капітанів буде по черзі набирати собі гравців у команду. Для цього пізніше потрібно буде відправити список капітанів, або вказати, щоб я сам обрав їх зі списку гравців випадковим чином.
`
  try {
    await ctx.replyWithHTML(reply, splitVariantButtons)
  } catch (err) {
    await handleError(err, ctx)
  }
}
