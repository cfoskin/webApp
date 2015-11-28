var express = require('express');
var controller = require('./orders.controller');

var router = express.Router();

//router.get('/getOrders', controller.index);
router.post('/addOrder', controller.create);

module.exports = router;