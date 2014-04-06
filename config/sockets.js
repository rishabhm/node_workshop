var io,
	ss,
	CLIENT_SOCKETS = {},
	DEVICE_SOCKETS = {};

exports.init = function (set_io) {
	io = set_io;
}

exports.initSS = function (set_ss) {
	ss = set_ss
}

exports.get = function (triggerVal, callback) {
	ss.on('connection', function (err, socket, session) {
		socket.on(triggerVal, function (data) {
			callback(data, socket, session);
		})
	})
}

exports.storeClientSocket = function (socket) {
	CLIENT_SOCKETS[socket.id] = socket;
}

exports.getClientSocket = function (socket_id) {
	return CLIENT_SOCKETS[socket_id];
}

exports.storeDeviceSocket = function (socket) {
	DEVICE_SOCKETS[socket.id] = socket;
}

exports.getDeviceSocket = function (socket_id) {
	return DEVICE_SOCKETS[socket_id];
}
