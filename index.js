const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const keys = require('./config/keys')
require('./models/user')
require('./services/passport')

mongoose.connect(keys.mongoURI)

const app = express()

//app.use are middlewares which come BEFORE route handlers (get, post etc)
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 *1000,
        keys: [keys.cookieKey]
    })
)
app.use(passport.initialize())
app.use(passport.session())

////longer way of defining routes and calling the function
// const authRoutes = require('./routes/authRoutes')
// authRoutes(app)

require('./routes/authRoutes')(app) // shorter syntax of above. return function and immediately calls function with app param.


// // basic test for express to work
// app.get('/', (req, res) => {
//     res.send({bye: 'buddy'})
// })

// dynamic port binding for heroku
const PORT = process.env.PORT || 5000
app.listen(PORT)