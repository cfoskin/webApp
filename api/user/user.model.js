var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PhoneSchema = new Schema({
	name: { type: String, required: true },
	price: { type:Number, required: false }
});

var OrderSchema = new Schema({
	total: { type: Number, required: false },
	dispatchStatus: { type: String, required: true },
	orderedProducts:[PhoneSchema]
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
