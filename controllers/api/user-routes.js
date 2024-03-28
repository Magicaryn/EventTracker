const router = require('express').Router();
const { User, Writeup, Comment } = require('../../models');
const passport = require('passport');
const local = require('../../strategies/local');


router.get('/signup', async (req, res) => {
    res.render('homepage');
});

router.get('/check', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json(err);
    }
});

//login route that redirects to employee or manager page based on user.position
router.post('/login', passport.authenticate('local'), async (req, res) => {
    const user = req.user;
    if (user) {
        const userData = await User.findOne({ where: { username: user.username } });
        if (userData.position == 1) { // Fix: Use strict equality (===) instead of loose equality (==)
            res.redirect('/employee');
        } else if (userData.position == 2) {
            res.redirect('/manager');
        } else {
            res.status(401).json({ error: 'Unauthorized', position: userData.position });
        }
    } else {
        res.redirect('/');
    }
});


//signup route that creates a new user and logs them in
router.post('/signup', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        res.status(200).json(userData);

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