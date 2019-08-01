module.exports = (req, res, next) => {
    if(!req.user) {
        return res.status(401).send({ error: 'You must log in!' })
    }
    next() //this is called in case user IS logged in
}