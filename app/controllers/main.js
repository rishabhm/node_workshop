var mongoose 	= require('mongoose'),
	Users 		= mongoose.model('Users');

exports.home = function (req, res) {
	res.render('home')
}