var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PhoneSchema = new Schema({
	price: { type: String, required: true },
	name: { type: String, required: true },
	snippet: { type: String, required: true },
});

var OrderSchema = new Schema({
	orderedProducts: [PhoneSchema],
	isCompleted: { type: Boolean, required: true },
	orderTotal: { type: Number, required: true },
	orderNum: { type: Number, required: true },
	orderStatus: { type: String, required: true },
	dispatchStatus: {type: String, require: true},
});

module.exports = mongoose.model('orders', OrderSchema);
