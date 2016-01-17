// set up ======================================================================
global = require('./global'); //global veriables.
var path = require('path');
var express  = require('express');
var app      = express(); 								// create our app w/ express
var port  	 = process.env.PORT || 8000; 				// set the port
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var ip = require("ip");
var tools = require('./tools');


// configuration ===============================================================
app.use('/', express.static(path.join(__dirname, 'public'))); // set the static files location /public/images will be /images for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// routes ======================================================================
require('./routes.js')(app, tools, io);

// listen (start app with node server.js) ======================================
//Listen on all interfaces '0.0.0.0 in order for the server to be accessible from the internet.
var server = app.listen(port, '0.0.0.0', function(){
	  var address = server.address();
		tools.logToConsole('NODEJS_SERVER', 'Server started: http://' + address.address + ':'+ address.port);
		tools.logToConsole('NODEJS_SERVER', 'Connect to the server via: \n' + '   http://' + ip.address() + ':' + port + '\n   http://localhost:' + port);

});

// Socket.IO part
var io = require('socket.io')(server);
//also set the ion on the global object, so that it can be used by other JS files.
global.io = io;

io.on('connection', function (socket) {
	tools.logToConsole('WEBSOCKETS', 'New remote client ' + socket.request.connection.remoteAddress +':'+ socket.request.connection.remotePort + ' connected;');
	// NOTE:This is disabled because the the REST API in routes.js is used to fetch the TODOs instead.
	// socket.on('fetchTodos', function () {
	// 	tools.sendToWebSockets(global.todosFile, socket);
	// });

	socket.on('newTodo', function (todo, callback) {
		tools.logToConsole('WEBSOCKETS', 'Remote client ' + socket.request.connection.remoteAddress +':'+ socket.request.connection.remotePort + '; Create new TODO');
		global.fs.readFile(global.todosFile, 'utf8', function(err, todos) {
			todos = JSON.parse(todos);
			todo.id = global.uuid.v1();
			todos.push(todo);
			global.fs.writeFile(global.todosFile, JSON.stringify(todos, null, 4), function (err) {
				io.emit('todos', todos);
				callback(err);
			});
		});
	});

	// NOTE:This is disabled because the the REST API in routes.js is used to fetch the TODOs instead.
	// socket.on('deleteTodo', function (todo_id, callback) {
	// 	tools.logToConsole('WEBSOCKETS', 'Remote client ' + socket.request.connection.remoteAddress +':'+ socket.request.connection.remotePort + '; Delete TODO with id' + todo_id);
	// 	global.fs.readFile(global.todosFile, 'utf8', function(err, todos) {
	// 		todos = tools.deleteItemInArrayById(todo_id, todos);
	// 		global.fs.writeFile(global.todosFile, JSON.stringify(todos, null, 4), function (err) {
	// 			io.emit('todos', todos);
	// 			callback(err);
	// 		});
	// 	});
	// });
});
