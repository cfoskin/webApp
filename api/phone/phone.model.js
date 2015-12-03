var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PhoneSchema = new Schema({
	age: { type: String, required: true },
	id: { type: String, required: true },
	price: { type: Number, required: true },
	imageUrl: { type: String, required: true },
	name: { type: String, required: true },
	snippet: { type: String, required: true },
});

module.exports = mongoose.model('phones', PhoneSchema);
