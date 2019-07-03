const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send({bye: 'buddy'})
})

// dynamic port binding for heroku
const PORT = process.env.PORT || 5000
app.listen(PORT)