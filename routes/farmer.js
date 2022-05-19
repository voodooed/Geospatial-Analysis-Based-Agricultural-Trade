var express = require('express');
const farmerController = require('../farmer/controller');
const utils = require('../utility/util');
var router = express.Router();

router.post('/addCrops', utils.authenticateToken, farmerController.addCrop);
router.post('/updateCrop', utils.authenticateToken, farmerController.updateCrop);
router.post('/deleteCrop', utils.authenticateToken, farmerController.deleteCrop);
router.post('/getCrop', utils.authenticateToken, farmerController.getCrop);
router.post('/myOrders', utils.authenticateToken, farmerController.myOrders)


module.exports = router