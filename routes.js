module.exports = function(app, tools) {


	// api ---------------------------------------------------------------------

	// get all todos
	app.get('/api/todos', function(req, res) {
		//Get the todos from json file.
		//Alternativelly, it could be a database
		global.fs.readFile(global.todosFile, 'utf8', function(err, todos) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			todos = JSON.parse(todos);
			res.setHeader('Cache-Control', 'no-cache');
			res.json(todos); // return all todos in JSON format
		});
	});


	// // create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {
		//Get the todos from json file.
		//Alternativelly, it could be a database
		global.fs.readFile(global.todosFile, 'utf8', function(err, todos) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			var todos = JSON.parse(todos);
			var newTodo = {
				id: global.uuid.v1(),
				author: req.body.author,
				text: req.body.text,
			};
			todos.push(newTodo);

			global.fs.writeFile(global.todosFile, JSON.stringify(todos, null, 4), function (err) {
				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
				if (err)
					res.send(err)

	      res.setHeader('Cache-Control', 'no-cache');
	      res.json(todos);
				global.io.emit('todos', todos);
	    });
  	});
	});


	//
	// // delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		var todo_id = req.params.todo_id;
		global.fs.readFile(global.todosFile, 'utf8', function(err, todos) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			todos = tools.deleteItemInArrayById(todo_id, todos);
			global.fs.writeFile(global.todosFile, JSON.stringify(todos, null, 4), function (err) {
				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
				if (err)
					res.send(err)

				//Once the files is updated send the TODOs to alll the clients via the WebSocket
				res.setHeader('Cache-Control', 'no-cache');
				res.json('success');
				global.io.emit('todos', todos);
			});
		});

	});
	

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		tools.logToConsole('NODEJS_SERVER', 'Remote client ' + req.connection.remoteAddress +':'+ req.connection.remotePort + ' get the TODO app');
		res.sendFile('index.html', {root: __dirname + '/public'}); // load the single view file (react will handle the page changes on the front-end)
	});
};
