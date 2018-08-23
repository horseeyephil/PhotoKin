const passport = require('passport')
const router = require('express').Router()
const FacebookStrategy = require('passport-facebook').Strategy
const {User} = require('../db/models')

module.exports = router


const strategy = new FacebookStrategy({
    clientID: process.env.FACEBOOKCLIENTID,
    clientSecret: process.env.FACEBOOKAUTHSECRET,
    // callbackURL: 'https://172.16.21.145:8080/auth/fb/successCallBack'
    callbackURL: process.env.FACEBOOKAUTHCALLBACK
},
    (accessToken, refreshToken, profile, done) => {

        console.log('What is this ',profile)
        User.findOrCreate({
            where: {name: profile.displayName, facebookId: profile.id, email: profile.displayName}
        }).then(user => done(null, user[0]))
        .catch(done)
    }
)

passport.use(strategy)

router.get('/', passport.authenticate('facebook'))

router.get('/successCallBack', passport.authenticate('facebook', {successRedirect: '/home', failureRedirect: '/login'}))
