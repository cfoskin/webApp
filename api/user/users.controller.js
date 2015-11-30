var _ = require('lodash')

var User = require('./user.model');  // NEW line
function handleError(res, err) {
	return res.send(500, err);
}
    // Get list of users
    exports.index = function(req, res) {
     User.find(function (err, users) {
       if(err) { return handleError(res, err); }
       return res.json(200, users);
     });
   } ;

     // Creates a new user in datastore.
     exports.create = function(req, res) {
       User.create(req.body, function(err, user) {
         if(err) { return handleError(res, err); }
         return res.json(201, user);
       });
     };
// Update an existing user in datastore.
exports.update = function(req, res) {
  User.findById(req.params.id, function (err, user) {
  // user.name = req.body.name;
  // user.lastName = req.body.lastName;
  // user.email = req.body.email;
  // user.address = req.body.address;
  // user.password = req.body.password;
  user.orders = req.body.orders;
  user.save(function (err) {
    if(err) { return handleError(res, err); }
    return res.send(200, 'Update successful');
  });
});
}
      // Deletes a customer from datastore.
      exports.destroy = function(req, res) {
        User.findById(req.params.id, function (err, user) {
          user.remove(function (err) {
            if(err) { return handleError(res, err); }
            return res.send(200,'Deleted');
          });
        })
      }