const mongoose = require('mongoose')
// const Schema = mongoose.Schema
const {Schema} = mongoose //destructuring of above. does exactly same as above line

const userSchema = new Schema({
    googleId: String,
    credits: { type: Number, default: 0 }
})

mongoose.model('users', userSchema)