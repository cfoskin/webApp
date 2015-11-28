var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true } ,
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	address: { type: String, required: true } ,
	password: { type: String, required: true },
	orders: { type: Array, required: false },
	shoppingCart: { type: Object, required: false },

});
module.exports = mongoose.model('users', UserSchema);
