var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	total: { type: Number, required: false },
	dispatchStatus: { type: String, required: true },
	status: { type: String, required: true },
});

var UserSchema = new Schema({
	name: { type: String, required: true } ,
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	address: { type: String, required: true } ,
	password: { type: String, required: true },
	orders: [OrderSchema],
});
module.exports = mongoose.model('users', UserSchema);
