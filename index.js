const { Telegraf, Scenes, session, Markup } = require('telegraf');
const mongoose = require('mongoose');
const CalbackModel = require('./models/CallbackQuery');
const FaylQuery = require("./models/FaylQuery");
const { kiritish, ism } = require('./scanes/taklif');
const { sortabel } = require('./data');
const { rasmWizard } = require('./scanes/rasmli');
const { videoWizard } = require('./scanes/videoli');
const Stage = Scenes.Stage;
const stage = new Stage();
const bot = new Telegraf('1971156264:AAF2LN5FxIt1430Js2v232ShZy8aNFGLkW8')
bot.use(session())
bot.use(stage.middleware())
bot.use(new Scenes.Stage([kiritish, ism, rasmWizard, videoWizard]))
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://15a.mongo.evennode.com:27019,15b.mongo.evennode.com:27019/9362e7daea6ea7818bd33f769f34f044?replicaSet=eu-15')
    .then(() => console.log("Bazaga bog'landi"))
    .catch(e => console.log("hatolik bor \n", e.message))
bot.start(msg => {
    // msg.reply('Assalomu aleykum Hurmatli mijoz. Botimizdan foydalanish uchun kerakli buyruqlarni togri amalga oshiring.')
    msg.reply('Bu yerda botning start message qismi boladi. Shuni tayorlash kerak.', Markup.keyboard([
        ["Rasimli kontent", "Videoli kontent"]
    ]).resize().oneTime())
    // msg.scene.enter('kiritish')
})

bot.hears('Rasimli kontent', async msg => {
    await msg.reply("Rasmingizni yuboring.")
    msg.scene.enter('rasmlar')
})

bot.hears("Videoli kontent", async msg => {
    await msg.reply("Videoingizni yuboring.")
    msg.scene.enter('videolar')
})

// status 
/*
    creator
    left
    adminstrator
    member

*/


// bot.on('message', async msg => {
//     // console.log(msg)
//     msg.reply('Message ketdi')
//     // console.log(msg.chat)
//     // console.log(msg.channelPost)
//     const channe = await bot.telegram.getChatMember(-1001507216679, msg.from.id)
//     console.log('yangi', channe)
// })

bot.hears('kanal', msg => {
    bot.telegram.sendMessage(-1001507216679, "Message ketdiku mana :)")
})


bot.on("callback_query", async msg => {
    const message = msg.callbackQuery.message.caption;
    const bosilganelement = msg.callbackQuery.data;
    const id = msg.from.id;
    const userslist = await FaylQuery.findOne({ message: message })
    const channe = await bot.telegram.getChatMember(-1001507216679, msg.from.id)
    if (channe.status == "left") {
        return await msg.answerCbQuery("Siz ovoz berishda qatnasha olmaysiz sababi siz bu kanalga obuna bo'lmagansiz.")
    }

    const idbosdimi = userslist.users.filter(data => data.user == id);
    if (idbosdimi.length == 1) {
        return await msg.answerCbQuery('Siz royhatda ishtirok etgansiz.')
    } else {
        await FaylQuery.findOneAndUpdate({ message: message }, { $push: { users: { user: id, text: bosilganelement } } })
        const yangiruyhat = await FaylQuery.findOne({ message: message });
        const sortlanganuserlar = sortabel(yangiruyhat.users, yangiruyhat.data);

        await msg.editMessageCaption(yangiruyhat.message, Markup.inlineKeyboard([
            ...sortlanganuserlar.map(user => {
                return [Markup.button.callback(user.text + " " + user.count, user.text)];
            })
        ]))

        return await msg.answerCbQuery("Ro'yxatda ishtirok etganingiz uchun katta rahmat.")
    }


})

bot.on('channel_post', async msg => {
    // console.log(msg)
    console.log(msg.callbackQuery)
    msg.reply('Ok hammasi')
    console.log('sender_chat', msg.update.channel_post.sender_chat)
    console.log('chat', msg.update.channel_post.chat)
    console.log('msg ', msg.chatMember)
    const channe = await bot.telegram.getChatMember(-1001507216679, 1971156264)
    console.log('channe', channe)
})
bot.launch();