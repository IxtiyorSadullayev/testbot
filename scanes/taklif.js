const { Scenes, Composer, Markup , Telegram} = require('telegraf');
const { StartBtn } = require('../keyboards/start');
const CalbackModel = require('./../models/CallbackQuery');
const BaseScene = Scenes.BaseScene;
const WizardScene = Scenes.WizardScene;
const ism = new BaseScene('ism');
const { leave } = Scenes.Stage;
const birinchi = new Composer();
birinchi.start(async msg => {
    msg.scene.state.odam = []
    msg.scene.state.id = msg.from.id;
    await msg.reply("Postingizning asosiy matnini kiriting. Iloji boricha chiroyli ravishda yozing.")
    return msg.wizard.next();
})

const ikkinchi = new Composer();
ikkinchi.on("message", async msg => {
    msg.scene.state.data = msg.message.text;
    await msg.reply("Ok. Rahmat. Endi Tagiga kimlarni ismini yozib qoldirish kerak ?")
    return msg.wizard.next();
})

const odam = new Composer();
odam.on("message", async msg => {
    msg.scene.state.odam.push(msg.message.text)
    await msg.reply('Ism yozib qolindi. Endi kerakli kamandani tanlang. ', StartBtn);
    return msg.wizard.next();
})

const chiqish = new Composer();
chiqish.hears('Add', async msg => {
    await msg.reply('Kerakli ismni yozib qoldiring. ')
    return msg.wizard.back();
})
chiqish.hears("Exit", async msg => {
    // console.log(msg.scene.state)
    const users = msg.scene.state.odam;

    await msg.telegram.sendMessage(-1001507216679, msg.scene.state.data, Markup.inlineKeyboard([
        ...users.map(user => {
            return [Markup.button.callback(user, user),]
        })
    ]));
    const newquery = await CalbackModel.create({message: msg.scene.state.data, data: users})
    console.log("newquery", newquery)
    await msg.reply('Hizmatimizdan foydalanganingiz uchun katta rahmat.', {
        reply_markup: {
            remove_keyboard: true
        }
    })

    return msg.scene.leave();
})



const kiritish = new WizardScene('kiritish', birinchi, ikkinchi, odam, chiqish);
module.exports = { kiritish, ism }