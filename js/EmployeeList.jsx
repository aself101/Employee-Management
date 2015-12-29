/* 
	Lists all employees
	- Ajax call which GETs employees based on EmployeeID and dumps table response
	- Class instantiated within Main
*/
var React = require('react');
var DeleteEmployee = require('./DeleteEmployee');
var EditEmployee = require('./EditEmployee');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			data: [],
			reqs: [],
			forms: [],
			allForms: [],
			eid: ''
		};
	},
	// For Edit and View
	getEmployee: function(e) {
		$.ajax({
			type: 'GET',
			url: 'php/view.php?name='+e,
			dataType: 'json',
			cache: false,
			success: function(data) {
				//console.log(data);
				this.setState({eid: data[0].EmployeeId});
				this.setState({data: data});
				this.getRequirements(e);
			}.bind(this),
			error: function(xhr, success, err) {
				console.error(xhr, status, err.toString());
			}.bind(this)
		});

	},
	/* Nested ajax call to grab requirements and form keys/values */
	getRequirements: function(e) {
		
		$.ajax({
			type: 'GET',
			url: 'php/view.php?eid='+e,
			dataType: 'json',
			cache: false,
			success: function(data) {
				/* For inserting values in Edit input fields */
				$(".activeInput").each(function() {
					var i = $(this).attr('placeholder');
					var val = $(this).val(i);
				});

				var seenForm = {};
				var seenDept = {};
				var formnames = [];
				var depts = [];
				var j = 0, k = 0;
				/* Find only the distinct form & dept names */
				for (var i = 0; i < data.length; i++) {
					var form = data[i].FormName;
					var dept = data[i].Department;
					if (seenForm[form] !== 1) {
						// Form is unique, keep one
						seenForm[form] = 1;
						// If form is not in the unique form array, 	
						formnames[j++] = form;	
					}	
					if (seenDept[dept] !== 1) {
						seenDept[dept] = 1;
						depts[k++] = dept;
					}
				}
				/* Once unqiue form values are found, output the requirements and associated values */
				/* Dynamic fields can only be modified in the user submitted form section */
					for (var i = 0; i < formnames.length; i++) {
						$('.userAddedForms').append(	
							"<div class='panel panel-default'>" +
								"<div class='panel-heading'>" +
									"<h3 class='panel-title'>" + formnames[i] + "<div style='float:right;'><i>" + depts[i] + "</i></div>" + "</h3>" +
								"</div>" +
							"</div>"	 
						);		
						for (var j = 0; j < data.length; j++) {
							if (formnames[i] === data[j].FormName) {
								if(data[j].Value === 'n/a' || data[j].Value === '["N/A"]' || data[j].Value === 'N/A') {
									data[j].Value = '<b style="color:red;">' + 'N/A' + '</b>';
								}
								$('.userAddedForms').append(	
									"<div class='row'>" +
										"<div class='col-xs-4'>" +
											"<b>" + data[j].Requirement + ": </b>" + 
										"</div>" +	
										"<div class='col-xs-4'>" +
											data[j].Value +
										"</div>" +		
									"</div>"
								);
							}
						}
						$('.userAddedForms').append("<br />");
					}
			}.bind(this),
			error: function(xhr, success, err) {
				console.error(xhr, status, err.toString());
			}.bind(this)
		});
	},

	reset: function() {
		this.setState({data: this.state.data});
	},

	render: function() {
		var employees = this.props.data.map(function(e) {
			return (
				<tr key={e.EmployeeId}>
					<td>{e.firstName} {e.lastName}</td>
					<td>{e.Email}</td>
					<td>{e.Manager}</td>
					<td><a href="#" data-toggle="modal" data-target="#edit" id={e.EmployeeId} ref={e.EmployeeId} onClick={this.getEmployee.bind(this, e.EmployeeId)}><i className="glyphicon glyphicon-info-sign"></i> View & Edit</a></td>
					<td><a href="#" data-toggle="modal" data-target="#delete" id={e.EmployeeId} ref={e.EmployeeId} onClick={this.getEmployee.bind(this, e.EmployeeId)}><i className="glyphicon glyphicon-trash"></i> Delete</a></td>
				</tr>
			);
		}.bind(this));
		return (
			<div>
				<div className="employeeList">
					<table className="table table-responsive table-bordered table-hover">
						<tr><th>Name</th><th>Email</th><th>Manager</th><th>View & Edit</th><th>Delete</th></tr>
						<tbody id="employees" ref="employees">
							{employees}
						</tbody>
					</table>
					<EditEmployee 
						data={this.state.data} 
						reqs={this.state.reqs} 
						forms={this.state.forms}
						eid={this.state.eid}
						onChange={this.reset} />
					<DeleteEmployee data={this.state.data} />
				</div>
			</div>	
		);
	}
});

