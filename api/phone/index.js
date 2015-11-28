
var express = require('express');
var controller = require('./phones.controller');

var router = express.Router();

router.get('/getPhones', controller.index);
router.post('/addPhones', controller.create);

module.exports = router;