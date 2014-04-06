module.exports = function (app, io, ss) {

	var fs = require('fs'),
		path = require('path'),
		main = require('../app/controllers/main'),
		s_obj = require('../config/sockets');

	s_obj.init(io);
	s_obj.initSS(ss);

	app.get('/*', main.home)

}