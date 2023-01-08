const { Markup } = require('telegraf');

const StartBtn = Markup.keyboard([
    ["Add",'Exit']
]).resize().oneTime();

module.exports = { StartBtn };