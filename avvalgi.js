const data = msg.callbackQuery.message.reply_markup.inline_keyboard.map(data => data[0].text);
    console.log("data", data)
    const message = msg.callbackQuery.message.text;

    const condidate = await CalbackModel.findOne({ message: message })
    console.log("condidate", condidate)
    if (!condidate) {
        const newdata = await CalbackModel.create({ message: message, data: data })
        await msg.answerCbQuery('Qaytadan tanlang.')
        console.log(newdata)
    } else {
        const top = await CalbackModel.findOne({ message: msg.callbackQuery.message.text })
        const user = top.users.filter(data => data.user == msg.from.id).length == 0
        if (user) {

            const update = await CalbackModel.findOneAndUpdate({ message: msg.callbackQuery.message.text }, { $push: { users: { user: msg.from.id, text: msg.callbackQuery.data } } })
            const newmsd = sortabel(top.users, top.data);
            await msg.editMessageText(msg.callbackQuery.message.text, Markup.inlineKeyboard([
                ...newmsd.map(data => {
                    return [Markup.button.callback(data.text + `\t${data.count}`, data.text)]
                })
            ]))
            await msg.answerCbQuery(`Siz ${msg.callbackQuery.data} ni tanladingiz.`)
        }
        else {
            const dd = await CalbackModel.findOne({ message: msg.callbackQuery.message.text })
            const newmsd = sortabel(dd.users, dd.data);
            await msg.editMessageText(dd.message, Markup.inlineKeyboard([
                ...newmsd.map(data => {
                    return [Markup.button.callback(data.text + `\t${data.count}`, data.text)]
                })
            ]))
            await msg.answerCbQuery(`Siz allaqachon taklifda ishtirok etgansiz`)
        }
    }