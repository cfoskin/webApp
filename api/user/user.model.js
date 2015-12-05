var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PhoneSchema = new Schema({
	name: { type: String, required: true },
	price:  { type: Number, validate: [function(price) {
		return price > 0;
	},
	'price must be positive'
	], required: true }
});

var OrderSchema = new Schema({
	status: { 
		type: String, enum: ['incomplete','Completed'], required: true
	},

	total: { type: Number, validate: [function(total) {
		return total > 0;
	},
	'Total must be positive'
	], required: true 
},

dispatchStatus: { type: String, required: true },
orderedProducts:[PhoneSchema]
});

var UserSchema = new Schema({
	role: { 
		type: String, enum: ['Admin','User'] , required: true
	},
	name: { type: String, required: true } ,
	lastName: { type: String, required: true },
	email: { type: String, required: true , match: /.+\@.+\..+/},//fix register.html
	address: { type: String, required: true } ,
	password: { 
		type: String, validate: [function(password) {
			return password.length >= 4;
		},
		'Password should be longer'
		], required: true },
		orders: [OrderSchema],
	});

UserSchema.pre('update', function() {
  this.update({},{ $set: { updatedAt: new Date() } });
});

UserSchema.post('init', function(doc) {
	console.log('%s has been initialized from the db', doc._id);
});
UserSchema.post('validate', function(doc) {
	console.log('%s has been validated (but not saved yet)', doc._id);
});
UserSchema.post('save', function(doc) {
	console.log('%s has been saved', doc._id);
});
UserSchema.post('remove', function(doc) {
	console.log('%s has been removed', doc._id);
});

UserSchema.post('save', function(next) {
	if(this.isNew) {
		console.log('A new user was created.');
	} else {
		console.log('A user updated its details.');
	}
});

module.exports = mongoose.model('users', UserSchema);
