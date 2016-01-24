var TodoBox = React.createClass({
	getInitialState: function () {
		return {
			todos: null
		};
	},
	fetchTodosViaRest: function() {
		var that = this;
		$.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(todos) {
        that.setState({todos: todos});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
	},
	componentDidMount: function () {
		var that = this;
		this.socket = io();

		this.socket.on('todos', function (todos) {
			that.setState({ todos: todos });
		});

		//Use WebSockets to fetch the TODOs list. The REST API call below should be disabled.
		//this.socket.emit('fetchTodos');

		//Use the REST API to fetch the TODOs list.
		this.fetchTodosViaRest();
		//Here it is not necessary to execute the fetchTodosViaRest repeatedly, because WebSockets will take care of updates.
		//Also setInterval makes the app load very slow
		// setInterval(this.fetchTodosViaRest, this.props.pollInterval);
	},
	submitTodo: function (todo, callback) {
		this.socket.emit('newTodo', todo, function (err) {
			if (err)
				return console.error('New TODO error:', err);
			callback();
		});
	},
	deleteTodo: function (id) {
		var that = this;
		//Use WebSockets to delete the TODO. The REST API call below should be disabled.
		// this.socket.emit('deleteTodo', id, function (err) {
		// 	if (err)
		// 		return console.error('Delete TODO error:', err);
		// });

		//Use the REST API to delete the TODO.
		$.ajax({
			url: this.props.url + '/' + id,
			dataType: 'json',
			type: 'DELETE',
			data: id,
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	render: function() {
		return (
			<div>
				<TodoHeading todos={this.state.todos}/>
				<TodoList todos={this.state.todos} deleteTodo={this.deleteTodo}/>
				<TodoForm submitTodo={this.submitTodo}/>
			</div>
		);
	}
});


var TodoHeading = React.createClass({
	render: function () {
		var Heading3 = (
				<div className="jumbotron text-center">
					<h1>TODOs <span className="label label-info">Loading....</span></h1>
				</div>
			);
		var that = this;
		if (this.props.todos) {
			return (
				<div className="jumbotron text-center">
					<h1>TODOs <span className="label label-info">{that.props.todos.length}</span></h1>
				</div>
			);
		}
		return (
			Heading3
		);
	}
});


var TodoList = React.createClass({
	render: function () {
		var Todos = (
				<p className="text-center">
					<span className="fa fa-spinner fa-spin fa-3x"></span>
				</p>
			);
		var that = this;
		if (this.props.todos) {
			Todos = this.props.todos.map(function (todo) {
				return (<Todo todo={todo} deleteTodo={that.props.deleteTodo} />);
			});
		}
		return (
			<div id="todo-list" className="row marketing">
				<div className="col-sm-12">
					{Todos}
				</div>
			</div>
		);
	}
});


var Todo = React.createClass({
	render: function () {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">{this.props.todo.author}</h3>
				</div>
				<div className="panel-body">
					<kbd>TODO:</kbd> {this.props.todo.text}
				</div>
				<div className="panel-footer">
					<div><button className="btn btn-sm btn-danger" type="delete" ref="deleteButton" onClick={this.props.deleteTodo.bind(this, this.props.todo.id)}>Delete</button></div>
				</div>
			</div>

		);
	}
});


var TodoForm = React.createClass({
	handleSubmit: function (e) {
		e.preventDefault();
		var that = this;
		var author = this.refs.author.getDOMNode().value;
		var text = this.refs.text.getDOMNode().value;
		var todo = { author: author, text: text };
		var submitButton = this.refs.submitButton.getDOMNode();
		submitButton.innerHTML = 'Posting a TODO...';
		submitButton.setAttribute('disabled', 'disabled');
		this.props.submitTodo(todo, function (err) {
			that.refs.author.getDOMNode().value = '';
			that.refs.text.getDOMNode().value = '';
			submitButton.innerHTML = 'Post a TODO';
			submitButton.removeAttribute('disabled');
		});
	},
	render: function () {
		return (
			<div id="todo-form" className="row">
				<div className="col-sm-8 col-sm-offset-2 text-center">
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<input type="text" name="author" ref="author" className="form-control input-lg text-left" placeholder="Name" required />
							<textarea name="text" ref="text" className="form-control input-lg text-left" placeholder="Todo" required></textarea>
						</div>
						<button type="submit" className="btn btn-primary btn-lg" ref="submitButton">Post a TODO</button>
					</form>
				</div>
			</div>
		);
	}
});


React.render(
	//Also pass the REST API end point as it will be used to fetch the TODOs instead of WebSockets.
	<TodoBox url="/api/todos" pollInterval={20000} />,
	document.getElementById('content')
);
