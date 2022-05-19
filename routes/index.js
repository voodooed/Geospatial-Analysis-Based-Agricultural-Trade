var express = require('express');
var buyerRoutes = require('./buyer')
var farmerRoutes = require('./farmer')
var authRoutes = require('./auth')

var router = express.Router();

router.use('/auth', authRoutes)

router.use('/buyer', buyerRoutes)
router.use('/farmer', farmerRoutes)

module.exports = router