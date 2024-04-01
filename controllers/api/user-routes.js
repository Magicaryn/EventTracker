const router = require('express').Router();
const { User, Writeup, Comment } = require('../../models');
const passport = require('passport');

//route to check for all the users in the database
router.get('/check', async (req, res) => {
        const userData = await User.findAll(req.body);
        res.status(200).json(userData);
});

router.get('/checkwriteups', async (req, res) => {
    try {
        const writeups = await Writeup.findAll();
        res.status(200).json(writeups);
    } catch (err) {
        res.status(402).json(err);
    }
});

// FOR TESTING: Check up route to retrieve writeups and their nested comments
router.get('/checkwriteups-comment', async (req, res) => {
    try {
        const writeups = await Writeup.findAll({
            where: { user_id: req.body.id},
            include: [
                {
                    model: Comment,
                    attributes: ['content', 'user_id']
                }
            ]
        })
        res.status(200).json(writeups);
    } catch (err) {
        res.status(402).json(err);
    }
});


//login route that redirects to employee or manager page based on user.position
router.post('/login', passport.authenticate('local'), async (req, res) => {
    //17-26 were only working in insomnia and i dont use this anymore but it shouldt stop anything from working
    const user = req.user;
    if (user) {
        const userData = await User.findOne({ where: { username: user.username } });
        if (userData.position == 1) { 
            res.redirect('/employee');
        } else if (userData.position == 2) {
            res.redirect('/manager');
        } else {
            res.status(401).json({ error: 'Unauthorized', position: userData.position });
        }
    //if authentication fails it will redirect to dashboard which redirects to login if you have no credentials
    } else {
        res.redirect('/dashboard');
    }
});


//signup route that creates a new user and logs them in
router.post('/signup', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.login(userData, (err) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.status(200).json(userData);
        });
        
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            res.status(400).json({ message: 'Validation error', errors: err.errors });
        } else {
            res.status(500).json(err);
        }
    }
});

//req.user
//req.user.username = username of current logged in user
//req.user.id .password .email .position
//route for logging out the user
router.post('/logout', (req, res) => {
    //if you are logged in then it will log you out and send you to the homepage
    try {
        if (req.user) {
            req.logout(() => {
                res.redirect('/');
            });
        } else {
            res.status(404).end();
        }
    } catch (err) {
        res.status(500).json(err);
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