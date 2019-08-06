# mongo-express-react-node-email-app
Simple email app created using react, mongodb, express, and node

## Live App  
https://survey-email-app.herokuapp.com/surveys/

## Highlights  
- Used [Concurrently](https://www.npmjs.com/package/concurrently) to run both client and server ports in dev
- Implemented [Stripe](https://stripe.com/docs/api/charges) api to accept dummy payments to add credits for user
- Emails for surveys are sent using [Sendgrid](https://app.sendgrid.com)
- Authentication is done using Google OAuth through [passport.js](http://www.passportjs.org/) 

### To run the app
- `gitclone`
- run `npm install` in root
- `cd client` and run `npm install` again
- `cd ..` and run `npm run dev`
