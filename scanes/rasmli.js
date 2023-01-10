const { Scenes, Composer, Markup } = require('telegraf');
const FaylQuery = require("./../models/FaylQuery");
const rasmlar = new Composer();
rasmlar.on('photo', async (msg) => {
    msg.scene.state.id = msg.from.id;
    msg.scene.state.photo = msg.message.photo[1].file_id;
    await msg.reply('Rasmingiz uchun caption kiriting.');
    return msg.wizard.next()
})

const captionrasm = new Composer();
captionrasm.on('message', async msg => {
    msg.scene.state.caption = msg.message.text;
    msg.scene.state.ishtirokchi = []
    await msg.reply('Tanlovda ishtirok etuvchini kirting.')
    return msg.wizard.next();
});

const addishtirokchi = new Composer();
addishtirokchi.on("message", async msg => {
    msg.scene.state.ishtirokchi.push(msg.message.text)
    await msg.reply("Ok rahmat. Quyidagi bo'limdan keragini tanlang.", {
        reply_markup: {
            keyboard: [
                ["Ishtirokchi qo'shish", "Natijani ko'rish"]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
    return msg.wizard.next()
})

const ishtirokchi = new Composer();
ishtirokchi.hears("Ishtirokchi qo'shish", async msg => {
    await msg.reply('Tanlovda ishtirok etuvchini kirting.')
    return msg.wizard.back();
})
ishtirokchi.hears("Natijani ko'rish", async msg => {
    const photo = msg.scene.state.photo;
    const caption = msg.scene.state.caption;
    const ishtirokchi = msg.scene.state.ishtirokchi;
    const id = msg.scene.state.id;
    await msg.replyWithPhoto(photo, {
        caption: caption,
        reply_markup: {
            inline_keyboard: [
                ...ishtirokchi.map(user => {
                    return [{ text: user, callback_data: user }]
                })
            ]
        }
    });
    await msg.reply("Quyidagi kamandalardan birini kiriting.", {
        reply_markup: {
            keyboard: [
                ["Kanalga chiqarish", "Boshqatdan ishlash."]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
    return msg.wizard.next();
})

const yakun = new Composer();
yakun.hears("Kanalga chiqarish", async msg => {
    const rasm = msg.scene.state.photo;
    const message = msg.scene.state.caption;
    const ishtirokchi = msg.scene.state.ishtirokchi;
    const tip = "Rasm";
    const newfile = await FaylQuery.create({ fayl: rasm, tip: tip, message: message, data: ishtirokchi });
    await msg.reply(`Kanalga yubordik. fayl id ${newfile._id}`,{
        reply_markup:{
            remove_keyboard: true
        }
    });
    await msg.telegram.sendPhoto(-1001507216679, rasm, {
        caption: message,
        reply_markup: {
            inline_keyboard: [
                ...ishtirokchi.map(user => {
                    return [{ text: user, callback_data: user }]
                })
            ]
        }
    })
    await msg.reply(`/start komandasi orqali yangi post tayorlashingiz mumkin`)
    return msg.scene.leave();
})
yakun.hears("Boshqatdan ishlash", async msg => {
    msg.scene.state = null;
    await msg.reply("/start komandasini bosing")
    return msg.scene.leave();
})

/*

await msg.replyWithPhoto(msg.message.photo[2].file_id, {
        caption: "Mana ajoyip rasm :)",
        reply_markup:{
            inline_keyboard: [
                [{text: "Birinchi", callback_data: "bir"}]
            ]
        }
    })

*/




const rasmWizard = new Scenes.WizardScene('rasmlar', rasmlar, captionrasm, addishtirokchi, ishtirokchi, yakun)
module.exports = { rasmWizard }