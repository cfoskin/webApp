
var express = require('express');
var controller = require('./users.controller');

var router = express.Router();

router.get('/getUsers', controller.index);
// router.get('/:id', controller.show);
 router.post('/addUser', controller.create);
// router.put('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;