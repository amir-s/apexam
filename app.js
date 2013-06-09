
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, io = require('socket.io');
var app = express();

app.configure(function(){
	app.set('port', 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', function (req, res) {
	res.render('index', { title: 'Express' });
});
app.get('/admin', function (req, res) {
	res.render('admin', { title: 'Express' });
});

var server = http.createServer(app);
io = io.listen(server);
server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
var admin_socket = null;
io.sockets.on("connection", function (socket) {
	var address = socket.handshake.address;	
	socket.uuu = 'unknown';
	console.log("New connection from " + address.address + ":" + address.port);
	if (address.address == '127.0.0.1' && admin_socket == null) {
		admin_socket = socket;
		return;
	}
	admin_socket.emit('j', address);
	socket.emit('message', {text: 'You are joined! '});
	socket.on('disconnect', function () {
		admin_socket.emit('dc', {address: address, username: socket.uuu});
	});
	socket.on('join', function (data) {
		console.log('asdasd' + data);
		socket.uuu = data.username;
		admin_socket.emit('join', {address: address, username: data.username});
	});
	
});




