var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			data: [],
			emp: ''
		}
	},

	deleteEmployee: function() {
		var output = this.refs.deleted.getDOMNode();
		var employee = this.props.data.map(function(e) {
			$.ajax({
				type: 'POST',
				url: 'php/view.php',
				data: {data: e.EmployeeId},
				dataType: 'json',
				cache: false,
				success: function(data) {
					$(output).html(
						"<div class='alert alert-success alert-dismissible'>" +
							"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
							"<span aria-hidden='true'>&times;</span>" +
							"</button>" +
							"<b>The following employee has been removed: </b>" + e.firstName + ' ' + e.lastName +
						"</div>"
					);
				}.bind(this),
				error: function(xhr, status, err) {
					console.error(xhr, status, err.toString());
				}.bind(this)
			});
		});
	},

	render: function() {
		var employee = this.props.data.map(function(e) {
			return (
				<div className="thumbnail">
					<center><h3><label className="label label-danger">{e.firstName} {e.lastName}</label></h3></center>
				</div>
			);
		}.bind(this));
		return (
			<div>
				<div className="modal fade" id="delete" tabIndex="-1" role="dialog" aria-labelledby="deleteEmployee">
				  <div className="modal-dialog modal-lg" role="document">
				    <div className="modal-content">
				      <div className="modal-header">
				        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				        <h4 className="modal-title" id="deleteEmployee">Employee Edit</h4>
				      </div>
				      <div className="modal-body">
				        <h2>Are you sure you want to delete the following employee?</h2>
				        {employee}
				      </div>
				      <div className="modal-footer">
				        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
				        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.deleteEmployee.bind(this, employee)}>Delete</button>
				      </div>
				    </div>
				  </div>
				</div>
				<div id="deleted" ref="deleted"></div>
			</div>
		);
	}
});