const router = require('express').Router();
const { Writeup, User, Comment } = require('../models');
const passport = require('passport');
const local = require('../strategies/local');

//base routes to render pages
//These routes will need hooks from a public folder js files
router.get('/', async (req, res) => {
    res.render('homepage');
});

router.get('/login', async (req, res) => {
    res.render('login');
});

router.get('/signup', async (req, res) => {
    res.render('signup');
});

//this route is rendered from logging in. Don't have the front end to check my passport methods yet to see if it only works if you have the correct crendentials
router.get(`/employee`, async (req, res) => {
    res.render('employee');
});

//this route is rendered from logging in. Don't have the front end to check my passport methods yet to see if it only works if you have the correct crendentials
router.get(`/manager`, async (req, res) => {
    res.render('manager');
});



module.exports = router;