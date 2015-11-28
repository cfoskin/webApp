var _ = require('lodash');
var Phone = require('./phone.model');  // NEW line

function handleError(res, err) {
	return res.send(500, err);
}
  // Get list of phones
  exports.index = function(req, res) {
   Phone.find(function (err, phones) {
        if(err) { return handleError(res, err); }
        return res.json(200, phones);
   });
} ;
 //used to put the phones in the db
 exports.create = function(req, res) {
 	Phone.create(req.body, function(err, phones) {
 		if(err) { return handleError(res, err); }
 		return res.json(201, phones);
 	});
 };