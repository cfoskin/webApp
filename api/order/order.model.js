var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PhoneSchema = new Schema({
	price: { type: String, required: true },
	name: { type: String, required: true },
	snippet: { type: String, required: true },
},{ _id : false });
  
var OrderSchema = new Schema({
	orderedProducts: [PhoneSchema],
	total: { type: Number, required: true },
	orderNum: { type: Number, required: true },
	dispatchStatus: {type: String, require: true},
	status: { type: String, required: true },
});

module.exports = mongoose.model('orders', OrderSchema);
