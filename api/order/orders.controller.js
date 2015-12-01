var _ = require('lodash');
var Order = require('./order.model');  // NEW line

function handleError(res, err) {
	return res.send(500, err);
}
  // Get list of orders
  exports.index = function(req, res) {
  	Order.find(function (err, orders) {
  		if(err) { return handleError(res, err); }
  		return res.json(200, orders);
  	});
  } ;
  // Creates a new order in datastore.
  exports.create = function(req, res) {
  	Order.create(req.body, function(err, order) {
  		if(err) { return handleError(res, err); }
  		return res.json(201, order);
  	});
  };

  // Update an existing order in datastore.
exports.update = function(req, res) {
  Order.findById(req.params.id, function (err, order) {
  order.dispatchStatus = req.body.dispatchStatus;
  order.save(function (err) {
    if(err) { return handleError(res, err); }
    return res.send(200, 'Update successful');
  });
});
}