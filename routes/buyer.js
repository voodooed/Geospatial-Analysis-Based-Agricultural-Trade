var express = require('express');
var router = express.Router();
const utils = require('../utility/util');
var buyerController = require('../buyer/controller')

router.get('/cropTypes', utils.authenticateToken, buyerController.cropList);
router.post('/getCropBuyers', utils.authenticateToken, buyerController.getCropBuyersList);
router.post('/getCartItems', utils.authenticateToken, buyerController.getCartItems);
router.post('/addItemToCart', utils.authenticateToken, buyerController.addCartItems);
router.post('/removeCartItems', utils.authenticateToken, buyerController.removeCartItems);
router.post('/placeOrder', utils.authenticateToken, buyerController.placeOrder);
router.post('/myOrders', utils.authenticateToken, buyerController.myOrders);


module.exports = router