const router = require('express').Router();
const { User, Writeup, Comment } = require('../../models');
const passport = require('passport');
const local = require('../../strategies/local');

//login route that redirects to employee or manager page based on user.position
router.post('/login', passport.authenticate('local'), (req, res) => {
    if (req.user.position === 1) {
        res.redirect('/employee');
    } else if (req.user.position === 2) {
        res.redirect('/manager');
    } else {
        res.status(200).json(req.user);
    }
});

//signup route that creates a new user and logs them in
router.post('/signup', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        req.login(userData, (err) => {
            if (err) throw err;
            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        res.redirect('/');
    } else {
        res.status(404).end();
    }
});

//route for creating a comment. public js file needed to send to this route
router.post('/comment', async (req, res) => {
    try {
        const commentData = await Comment.create(req.body);
        res.status(200).json(commentData);
    } catch (err) {
        res.status(400).json(err);
    }
});

//route for creating a writeup. public js file needed to send to this route
router.post('/writeup', async (req, res) => {
    try {
        const writeupData = await Writeup.create(req.body);
        res.status(200).json(writeupData);
    } catch (err) {
        res.status(400).json(err);
    }
});















module.exports = router;