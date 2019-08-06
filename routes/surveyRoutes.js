const _ = require('lodash')
const Path = require('path-parser').default
const { URL } = require('url') //node helper module
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const requireCredits = require('../middlewares/requireCredits')
const Mailer = require('../services/Mailer')
const surveyTemplate = require('../services/emailTemplates/surveyTemplates')

const Survey = mongoose.model('surveys')

module.exports = app => {
    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id })
            .select({ recipients: false });
        res.send(surveys)
    })

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!')
    })

    app.post('/api/surveys/webhooks', (req, res) => {
        // const events = _.map(req.body, ({ email, url }) => {
        //     var baseURL = 'http://' + req.headers.host + '/';
        //     const pathname = new URL(url, baseURL).pathname
        //     const p = new Path('/api/surveys/:surveyId/:choice')
        //     const match = p.test(pathname)
        //     if(match) {
        //         return { email, surveyId: match.surveyId, choice: match.choice }
        //     }
        // })
        // const compactEvents = _.compact(events)
        // const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId')

        // refactor of above
        const p = new Path('/api/surveys/:surveyId/:choice')
        _.chain(req.body)
            .map(req.body, ({ email, url }) => {
                var baseURL = 'http://' + req.headers.host + '/';
                const match = p.test(new URL(url, baseURL).pathname)
                if(match) {
                    return { email, surveyId: match.surveyId, choice: match.choice }
                }
            })
            .compact()
            .uniqBy('email', 'surveyId')
            .each(({ surveyId, email, choice }) => { //here search for survey and  update with yes no
                Survey.updateOne({
                    _id: surveyId, //mongo id is _id by default
                    recipients: {
                        $elemMatch: { email: email, responded: false }
                    }
                }, {
                    $inc: { [choice]: 1 }, //inc is increment property of mongo. [choice] is either 'yes' or 'no', not an array
                    $set: { 'recipients.$.responded': true },
                    lastResponded: new Date()
                }).exec()
            })
            .values()

        res.send({})
    })

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now()
        })

        // place to send an email
        const mailer = new Mailer(survey, surveyTemplate(survey)) //template is body of email
        
        try{
           await mailer.send()
            await survey.save()
            req.user.credits -= 1
            const user = await req.user.save()
            res.send(user) 
        } catch (err) {
            res.status(422).send(err)
        }
        
    })
}