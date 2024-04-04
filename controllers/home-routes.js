const router = require('express').Router();
const { json } = require('sequelize');
const { Writeup, User, Comment } = require('../models');
const passport = require('passport');


//base routes to render pages
//These routes will need hooks from a public folder js files
router.get('/', async (req, res) => {
    if (!req.user) {
        const loggedIn = req.user ? true : false;
        res.render('homepage', { loggedIn: loggedIn });
    } else {
        res.redirect('dashboard');
    }

});

router.get('/login', async (req, res) => {
    if (!req.user) {
        const loggedIn = req.user ? true : false;
         res.render('login', {loggedIn: loggedIn});
    } else {
        res.redirect('dashboard');
    }
});

router.get('/signup', async (req, res) => {
    if (!req.user) {
        const loggedIn = req.user ? true : false;
        res.render('signup', {loggedIn: loggedIn});
    } else {
        res.redirect('dashboard');
    }
});

//dashboard route is just for redirecting based on the logged in users position value. If you are not logged in if will send you to login
router.get('/dashboard', async (req, res) => {
    if (req.user) {
        if (req.user.position == 1) {
            res.redirect('/employee');
        } else if (req.user.position == 2) {
            res.redirect('/manager');
        }
    } else {
        res.redirect('/login')
    }
});


// Route for Employees
router.get('/employee', async (req, res) => {
    if (req.user){
        // Ensure that the user is not a manager before rendering the page
        const loggedIn = req.user ? true : false;
        if (req.user.position == 1){
            const usersData = await User.findAll();
            // Serialize the data
            const usersClean = usersData.map((user) => user.get({ plain: true }));
            // Filters data to only non-manager employees
            const users = usersClean.filter((user) => user.position == 1);

            const writeTemp = await Writeup.findAll({
                where: {user_id: req.user.id},
                include: [
                    { model: User, attributes: ['username'] },
                    { model: Comment, attributes: ['content', 'user_id', 'writeup_id'],
                        include: [{model: User, attributes: ['username']}]
                    }
                ]
            });
            const writeClean = writeTemp.map((writeup) => writeup.get({ plain: true }));
       
            res.render('employee', { username: req.user.username, id: req.user.id, users, writeups: writeClean, loggedIn: loggedIn});
        }
        else{
            res.redirect('/dashboard');
        }
    } else {
    res.redirect('/dashboard');
    }
});



//route for managers.
router.get(`/manager`, async (req, res) => {
    //the if checks if you have the correct credentials. So anything you want to show must be within the if statement
    if (req.user) {
        const loggedIn = req.user ? true : false;
        if(req.user.position == 2){
            const usersData = await User.findAll();
            //scrub headers from the data
            const usersClean = usersData.map((user) => user.get({ plain: true }));
            //filter to only employees
            const users = usersClean.filter((user) => user.position == 1);

            const writeTemp = await Writeup.findAll({
                include: [
                    { model: User, attributes: ['username'] },
                    { model: Comment, attributes: ['content', 'user_id', 'writeup_id'],
                        include: [{model: User,attributes: ['username']}]
                    }
                ]
            });
            const writeClean = writeTemp.map((writeup) => writeup.get({ plain: true }));
            const writeups = writeClean.filter((writeup) => writeup.acknowledged == false);

            res.render('manager', { username: req.user.username, id:req.user.id, users, writeups, loggedIn: loggedIn});
        }
        else{
            res.redirect('/dashboard');
        }
    } else {
    res.redirect('/dashboard');
    }
});


router.get('/writeup', async (req, res) => {
    if (req.user) {
        const loggedIn = req.user ? true : false;
        if(req.user.position == 2){
            const usersData = await User.findAll();
            //scrub headers from the data
            const usersClean = usersData.map((user) => user.get({ plain: true }));
            //filter to only employees
            const users = usersClean.filter((user) => user.position == 1);
            
            res.render('writeup', {username: req.user.username, users, loggedIn: loggedIn});
        } else {
            res.redirect('/dashboard');
        }
    } else {
         res.redirect('/login');
    }
});

module.exports = router;