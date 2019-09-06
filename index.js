const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const keys = require('./config/keys')
require('./models/user')
require('./models/survey')
require('./services/passport')

mongoose.connect(keys.mongoURI)

const app = express()

app.use(bodyParser.json())
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
require('./routes/billingRoutes')(app)
require('./routes/surveyRoutes')(app)

// // basic test for express to work
// app.get('/', (req, res) => {
//     res.send({bye: 'buddy'})
// })

if (process.env.NODE_ENV === 'production') {
    // express will serve up production assets like main.js or main.css
    app.use(express.static('client/build'))

    // express will serve up index.html if routes are not found in backend
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.get('/', (req, res) => {
    res.send('Success the server is running!')
})

// dynamic port binding for heroku
const PORT = process.env.PORT || 5000
app.listen(PORT)