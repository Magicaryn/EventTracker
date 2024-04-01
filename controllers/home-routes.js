const router = require('express').Router();
const { json } = require('sequelize');
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
        const userWriteups = await Writeup.findAll({
            where: {user_id: req.user.id},
            include: [{model: User}]
        })
    res.render('employee', { username: req.user.username, writeups:userWriteups});
    } else {
    res.redirect('/dashboard');
    }
});


//route for managers.
router.get(`/manager`, async (req, res) => {
    //the if checks if you have the correct credentials. So anything you want to show must be within the if statement
    if(req.user.position == 2){
        const usersData = await User.findAll();
        //scrub headers from the data
        const usersClean = usersData.map((user) => user.get({ plain: true }));
        //filter to only employees
        const users = usersClean.filter((user) => user.position == 1);

        const writeTemp = await Writeup.findAll({
            include: [
                { model: User, attributes: ['username'] },
                { model: Comment, attributes: ['content, user_id, writeup_id'] }
            ]
        });
        const writeClean = writeTemp.map((writeup) => writeup.get({ plain: true }));
        const writeups = writeClean.filter((writeup) => writeup.acknowledged == false);
      
   
    res.render('manager', { username: req.user.username, users, writeups});
    } else {
    res.redirect('/dashboard');
    }
});

router.get('/writeupEMP/:id', async (req,res) => {
    try {
        const writeupEMPdata = await Writeup.findByPk(req.params.id, {
            attributes: ['type', 'reason', 'manager', 'content'],
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'username']
                }
            ]
        })
        res.render('writeupEMP',{writeupEMPdata: writeupEMPdata})
    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/writeupFIN/:id', async (req, res) => {
    try{
        const finWriteup = await Writeup.findByPk(req.params.id, {
            attributes:  ['type', 'reason', 'manager', 'content', 'acknowledged'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'content']
                }
            ]
        })
        res.render('writeupFIN', {finalWriteup: finWriteup})
    } catch (err) {
        res.status(400).json(err)
    }
});

module.exports = router;