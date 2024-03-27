const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const db = require('../models');

passport.use(new LocalStrategy(
    async function(username, password, done) {
        const user = await db.User.findOne({ where: { username: username } });
        if (!user) {
            return done(null, false, { message: 'Incorrect Login.' });
        }
        if (!user.checkPassword(password)) {
            return done(null, false, { message: 'Incorrect Login.' });
        }
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    const user = await db.User.findByPk(id);
    done(null, user);
});

module.exports = passport;

//this page is for setting up passport authentication. 
//Have no actual idea if this works yet but i followed a tutorial and this is what they did.