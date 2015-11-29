var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	userId: { type: String, required: true},
	orderedProducts: { type: Array, required: true },
	isCompleted: { type: Boolean, required: true },
	orderTotal: { type: Number, required: true },
	orderNum: { type: Number, required: true },
	orderStatus: { type: String, required: true },
});

module.exports = mongoose.model('orders', OrderSchema);
