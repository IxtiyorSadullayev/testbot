const mongoose = require('mongoose')
const CalbackQuery = new mongoose.Schema({
    fayl: { type: String, required: true },
    tip: { type: String, required: true },
    message: { type: String },
    data: [String],
    users: Array
})

module.exports = mongoose.model('Fayl', CalbackQuery)