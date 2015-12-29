var React = require('react');
var intervalID;

module.exports = React.createClass({
	loadComments: function() {
		this.setState({name: this.props.name});
		$.ajax({
			url: 'php/view.php?employeeComments='+this.props.name,
			dataType: 'json',
			type: 'GET',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}.bind(this)
		});
	},

	getInitialState: function() {
		return {
			data: [],
			name: ''
		};
	},

	componentWillReceiveProps: function() {	
		intervalID = setInterval(this.loadComments, this.props.pollInterval);
	},

	render: function() {
		return (
			<div className="commentBox">
				<div className="page-header">	
					<h1>Comments</h1>
				</div>
				<CommentList data={this.state.data} />
				<CommentForm name={this.props.name} />
			</div>
		);
	}

});

var CommentForm = React.createClass({
	getInitialState: function() {
		return {
			name: ''
		}
	},

	componentWillReceiveProps: function() {
		this.setState({name: this.props.name});
	},

	handleSubmit: function(e) {
		e.preventDefault();
		var author = React.findDOMNode(this.refs.author).value.trim();
		var text = React.findDOMNode(this.refs.text).value.trim();	
		/* If neither author or text is unfilled do nothing */
		if(!text || !author) {
			return;
		}
		/* Submits comment with author */
		$.ajax({
			url: 'php/view.php?commentSubmit='+this.state.name,
			dataType: 'json',
			type: 'POST',
			data: {author: author, text: text},
			success: function(data) {
				//console.log(data);
			},
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});
		React.findDOMNode(this.refs.author).value = '';
	    React.findDOMNode(this.refs.text).value = '';
	    return;
	},

	render: function() {
		return (
			<div className="commentForm">
				<div className="row">
					<div className="col-xs-8">
						<input type="text" className="form-control input-sm" id="author" ref="author"  placeholder="Your Name..." />
						<br />
						<textarea type="text" className="form-control input-sm" id="text" ref="text" placeholder="Leave a comment..." rows="5"></textarea>
						<br />	
						<button className="btn btn-primary" onClick={this.handleSubmit}>Post</button>
					</div>
				</div>
			</div>	
		);		
	}
});

var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(com) {
			return (
				<div>
					<div className="row">
						<div className="col-xs-12">
							<h2>{com.Author}</h2>
						</div>	
					</div>	

					<div className="well well-lg comments">
						<b>{com.Comment}</b>
						<hr />
						{com.Date}
					</div>
				</div>
			);
		});
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});
