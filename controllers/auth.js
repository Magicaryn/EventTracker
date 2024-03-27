const router = require('express').Router();
const passport = require('passport');

router.post('/login', passport.authenticate('local') async (req, res) => {
    res.send(200).json(req.user);
});

module.exports = router;