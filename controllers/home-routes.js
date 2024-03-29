const router = require('express').Router();
const { Writeup, User, Comment } = require('../models');
const passport = require('passport');


//base routes to render pages
//These routes will need hooks from a public folder js files
router.get('/', async (req, res) => {
    const loggedIn = req.user ? true : false;
  res.render('homepage', { loggedIn: loggedIn });
});

router.get('/login', async (req, res) => {
    res.render('login');
});

router.get('/signup', async (req, res) => {
    res.render('signup');
});

//dashboard route is just for redirecting based on the logged in users position value. If you are not logged in if will send you to login
router.get('/dashboard', async (req, res) => {
    if (req.user) {
        if (req.user.position == 1) {
            res.redirect('/employee');
        } else if (req.user.position == 2) {
            res.redirect('/manager');
        } else {
            res.redirect('/login');
        }
    }
});

//route for employees
router.get('/employee', async (req, res) => {
    //the if checks if you have the correct credentials. So anything you want to show must be within the if statement
    if(req.user.position == 1){
    res.render('employee', { username: req.user.username });
    } else {
    res.redirect('/dashboard');
    }
});

//route for managers.
router.get(`/manager`, async (req, res) => {
    //the if checks if you have the correct credentials. So anything you want to show must be within the if statement
    if(req.user.position == 2){
    res.render('manager', { username: req.user.username });
    } else {
    res.redirect('/dashboard');
    }
});



module.exports = router;