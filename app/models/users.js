var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name 	: String,
	age 	: Number
});

userSchema.methods = {
	//METHODS HERE
}

mongoose.model('Users', userSchema);