var http = require('http');
var fs = require('fs');
var connect = require('connect');

var server = http.createServer(
		connect()
			.use(connect.static('client'))
			.use(connect.directory('client'))
	);

var io = require('socket.io').listen(server);

server.listen(80);

var colors = ["cyan","yellow","magenta","lightgreen"];
var count = 0;
var clients = {};

io.sockets.on('connection', function (socket) {
	clients[socket.id] = {}
	clients[socket.id].color = colors[count++ % 4];
	socket.emit('msg', {messagetype: 'color', color:clients[socket.id].color});

	socket.on('disconnect', function () {
		socket.broadcast.emit('msg', {messagetype: 'blur', id: clients[socket.id].position})
		delete clients[socket.id];
	});
	
	socket.on('msg', function (data) {
		if (data.messagetype == 'focus') {
			clients[socket.id].position = data.id;
		}
		if (data.messagetype == 'focus' || data.messagetype == 'selectcol' || data.messagetype == 'selectrow') {
			data.color = clients[socket.id].color;
		}
		socket.broadcast.emit('msg', data);
	});
});