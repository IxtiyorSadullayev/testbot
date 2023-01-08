const mongoose = require('mongoose')
const CalbackQuery = new mongoose.Schema({
    message: {type: String},
    data: [String],
    users: Array
})

module.exports = mongoose.model('Callback', CalbackQuery)