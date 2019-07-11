const passport = require('passport')

// Google Strategy has an internal identifier of 'google' which is use below
module.exports = app => {
    app.get(
            '/auth/google', passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    )

    app.get(
        '/auth/google/callback', passport.authenticate('google')
    )

    app.get('/api/logout', (req, res) => {
        req.logout()
        res.send(req.user)
    })

    app.get('/api/current_user', (req, res) => {
        // res.send(req.session) // here req.session contains the id record from passport
        res.send(req.user)
    });
}