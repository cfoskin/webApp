var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PhoneSchema = new Schema({
	age: { type: String, required: true },
	id: { type: String, required: true },
	price:  { type: Number, validate: [function(price) {
        return price > 0;
      },
      'Price must be positive'
    ], required: true },
	imageUrl: { type: String, required: true },
	name:  { type: String, validate: [function(name) {
        return name.length >= 4;
      },
      'name must be longer'
    ], required: true },
	snippet: { type: String, required: true },
});

PhoneSchema.post('save', function(next) {
	if(this.isNew) {
		console.log('A new user was created.');
	} else {
		console.log('A user updated its details.');
	}
});

module.exports = mongoose.model('phones', PhoneSchema);
