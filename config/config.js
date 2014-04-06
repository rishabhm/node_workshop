var path = require('path'),
	root = path.normalize(__dirname + '/..');

module.exports = {
	dev_mode : {
		db		: 'mongodb://localhost/test_dev',
		root 	: root,
		app		: {
			name	: 'test db : development mode'
		}
	}
}