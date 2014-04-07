var express 	= require("express"),
	app			= express(),
	http 		= require('http'),
	server 		= http.createServer(app),
	path 		= require('path'),
	io          = require('socket.io').listen(server, {log : false})

var groups = {},
	groupids = [],
	sockets = {}

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/hackillinois');
var groupSchema = new mongoose.Schema({
	uid : String,
	users : [],
	s_ids : []
})
mongoose.model('Groups', groupSchema)
var Groups = mongoose.model('Groups')

server.listen(3000)

app.configure(function(){
	app.set('views', 'views/');
    app.set('view engine', 'jade');
    app.use(express.static(path.resolve('./public')));
})

app.get('/create_group', function (req, res) {
	var uid = (new Date()).getTime().toString().slice(-5)
	// groupids.push(uid)
	// groups[uid] = {}
	var new_group = new Groups({uid : uid})
	console.log("Here")
	new_group.save(function (e1, d1) {
		res.redirect("/display_group?group="+uid)
	})
})

app.get('/join_group', function (req, res) {
	var group_id = req.query.group
	res.redirect('/display_group?group='+group_id)
})

app.get('/display_group', function (req, res) {
	var group_id = req.query.group
	// if (groupids.indexOf(group_id) == -1) {
	// 	res.redirect("/404")
	// } else {
	// 	res.render("groups", {group_id : group_id})
	// }
	Groups.findOne({uid : group_id}, function (err, g) {
		if (!g) {
			res.redirect('/404')
		} else {
			res.render("groups", {group_id : group_id})
		}
	})
})

app.get('/404', function (req, res) {
	res.render("404")
})

app.get("/home", function (req, res) {
	res.render("home")
})

io.sockets.on('connection', function (socket) {
	socket.on("join_group", function (data) {
		var group = data.group_id,
			user = data.user_name
		// if (!groups[group]['users']) {
		// 	groups[group]['users'] = []
		// }
		// groups[group]['users'].push(user)
		// if (!groups[group]['sockets']) {
		// 	groups[group]['sockets'] = []
		// }
		// groups[group]['sockets'].push(socket)
		// groups[group]['sockets'].forEach(function (s) {
		// 	s.emit("join_group_done", {user_name : user})
		// })
		Groups.findOne({uid : group}, function (err, g) {
			console.log(!g['users'])
			if (!g['users']) {
				g['users'] = []
			}
			g['users'].push(user)
			if (!g['s_ids']) {
				g['s_ids'] = []
			}
			g['s_ids'].push(socket.id)
			sockets[socket.id] = socket
			g.save(function (e2, d2) {
				g['s_ids'].forEach(function (s) {
					if (sockets[s]) {
						sockets[s].emit("join_group_done", {user_name : user})
					}
				})
			})
		})
	})

	socket.on('sending_msg', function (data) {
		var group = data.group_id,
			sender = data.user_name,
			msg = data.msg
		// groups[group]['sockets'].forEach(function (s) {
		// 	s.emit("recMsg", {user_name : sender, message : msg})
		// })
		Groups.findOne({uid : group}, function (err, g) {
			g['s_ids'].forEach(function (s) {
				if (sockets[s]) {
					sockets[s].emit("recMsg", {user_name : sender, message : msg})
				}
			})
		})
	})
})