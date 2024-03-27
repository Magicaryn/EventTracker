const router = require('express').Router();

const homeRoutes = require('./home-routes.js');
// const apiRoutes = require('./api');
const authRoutes = require('./auth');


// router.use('/api', apiRoutes);
router.use('/auth', authRoutes);
router.use('/', homeRoutes);

module.exports = router;