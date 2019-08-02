const mongoose = require('mongoose')
const { Schema } = mongoose

// sub doc for recipients array in survey model
const recipientSchema = new Schema({
    email: String,
    responded: { type: Boolean, default: false }
})

module.exports = recipientSchema