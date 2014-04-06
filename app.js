var	express 	= require('express'),
	mongoose 	= require('mongoose'),
	app 		= express(),
	http 		= require('http'),
	server 		= http.createServer(app),
	io          = require('socket.io').listen(server, {log : false}),
	path 		= require('path'),
	fs 			= require('fs'),
	config  	= require('./config/config')['dev_mode'],
	port 		= 3000;

mongoose.connect(config.db);
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
	require(models_path+'/'+file)
})

var MemoryStore = express.session.MemoryStore
sessionStore = new MemoryStore()

var cookieParser = express.cookieParser('insert_key');

app.configure(function() {
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(cookieParser);
    app.use(express.session({store:sessionStore, key:'insert_session_id', secret:'insert_key'}));
    app.use(express.static(path.resolve('./public')));
    app.use(app.router);
});

io.set('log level', 1)

var SessionSockets = require('session.socket.io'),
    sessionSockets = new SessionSockets(io, sessionStore, cookieParser, 'insert_session_id');

server.listen(port);
console.log('Listening to port '+port.toString()+'...');

require('./config/routes')(app, io, sessionSockets);