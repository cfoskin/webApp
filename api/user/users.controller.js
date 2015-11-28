var _ = require('lodash')
var datastore = require('../datastore');

var User = require('./user.model');  // NEW line

function handleError(res, err) {
	return res.send(500, err);
}

     // Get list of contacts
     exports.index = function(req, res) {
     	User.find(function (err, users) {
     		if(err) { return handleError(res, err); }
     		return res.json(200, users);
     	});
     } ;

      // Creates a new contact in datastore.
      exports.create = function(req, res) {
      	User.create(req.body, function(err, user) {
      		if(err) { return handleError(res, err); }
      		return res.json(201, user);
      	});
      };

      // Deletes a customer from datastore.
    exports.destroy = function(req, res) {
        User.findById(req.params.id, function (err, user) {
            user.remove(function (err) {
                if(err) { return handleError(res, err); }
                return res.send(200,'Deleted');
            });
        })
    }