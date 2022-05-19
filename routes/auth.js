var express = require('express');
var router = express.Router();
const authController = require('../auth/controller')

router.post('/register', authController.register)

router.post('/login', authController.login)

router.get('/logout', authController.logout)



module.exports = router