var React = require('react');

/* 
	Edits employee
	- Ajax call which edits employee based on EmployeeID and dumps validation response
*/
module.exports = React.createClass({
	getInitialState: function() {
		return {
			data: [],
			reqs: this.props.reqs,
			forms: this.props.forms,
			eid: this.props.eid
		};
	},

	getDate: function() {
		var hireDate = this.refs.hireDate2.getDOMNode();
		var startDate = this.refs.startDate2.getDOMNode();
		var endDate = this.refs.endDate2.getDOMNode();
		$(hireDate).datepicker();
		$(startDate).datepicker();
		$(endDate).datepicker();
	},

	editEmployee: function() {
		/* Get placeholder values; which are the current state */
		var inputs = [];
		var edit = this.refs.editedEmployee.getDOMNode();
		$(".activeInput").each(function() {
			var val = $(this).val();
			inputs.push(val);
		});
		
		$.ajax({
			type: 'POST',
			url: 'php/view.php',
			dataType: 'json',
			data: {input: inputs, eid: this.props.eid},
			success: function(data) {
				//console.log(data);
				this.setState({data: data});
				$(edit).html(
					"<div class='alert alert-success alert-dismissible'>" +
						"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
						"<span aria-hidden='true'>&times;</span>" +
						"</button>" +
						"<h4>Edit Successful for <b>" + data[0] + " " + data[1] + "</b>. Be sure to check changes to verify they are correct. </h4>" +
					"</div>"
				);
			}.bind(this),
			error: function(xhr, status, err) {
				$(edit).html(
					"<div class='alert alert-danger alert-dismissible'>" +
						"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
						"<span aria-hidden='true'>&times;</span>" +
						"</button>" +
						"<h4>Edit Failed. Check with your administrator. </h4>" +
					"</div>"
				);
				console.error(xhr, status, err.toString());
			}
		});
	},

	/* Removes appended data and resets */
	removeAppend: function() {
		$('.userAddedForms').html('');
	},

	panelRow: function(label, id, val) {
		return (
			<div className="row">
				<div className="col-xs-4">
					<label className="control-label"><b>{label}:</b></label>
				</div>
				<div className="col-xs-4">
					{val}
				</div>
				<div className="col-xs-4">
					<input type="text" id={id} ref={id} className="form-control input-sm activeInput" placeholder={val} />
				</div>
			</div>
		);
	},

	panelSelect: function(label, id, option, values, val) {
		var options = values.map(function(value) {
			return <option key={value} value={value}>{value}</option>
		});
		return (
			<div className="row">
				<div className="col-xs-4">
					<label className="control-label"><b>{label}:</b></label>
				</div>
				<div className="col-xs-4">
					{val}
				</div>
				<div className="col-xs-4">
					<select className="form-control input-sm activeInput" id={id} ref={id} >
					<option value="">{option}</option>
					{options}
					</select>
				</div>
			</div>
		);
	},

	panelDate: function(label, id, val, focus) {
		return (
			<div className="row">
				<div className="col-xs-4">
					<label className="control-label"><b>{label}:</b></label>
				</div>
				<div className="col-xs-4">
					{val}
				</div>
				<div className="col-xs-4">
					<input type="text" id={id} ref={id} onFocus={focus} className="form-control input-sm activeInput" placeholder={val} />
				</div>
			</div>
		);
	},

	render: function() {
		/* On clicking outside of modal, remove appended data */
		$('#edit').on('hidden.bs.modal', function() {
			$('.userAddedForms').html('');
		});

		var employee = this.props.data.map(function(e) {
			return (
				<div>
				<form ref="editForm" id="editForm">
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">General</h3>
						</div>
						<div className="panel-body">
							{this.panelRow("First Name","firstName",e.firstName)}
							{this.panelRow("Last Name","lastName",e.lastName)}
							{this.panelRow("Position","position",e.PTitle)}
							{this.panelRow("Manager","manager",e.Manager)}
							{this.panelDate("Hire Date","hireDate2",e.HireDate,this.getDate)}
							{this.panelDate("Start Date","startDate2",e.StartDate,this.getDate)}
							{this.panelDate("End Date","endDate2",e.EndDate,this.getDate)}
						</div>	
					</div>{/* end panel */}

					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">Account</h3>
						</div>
						<div className="panel-body">
							{this.panelRow("Account Name","accountName", e.AccountName)}
							{this.panelRow("Display Name","displayName",e.DisplayName)}
							{this.panelRow("Email","email",e.Email)}
							{this.panelRow("Network Home","unixHomeDir",e.UnixHomeDir)}
						</div>	
					</div> {/* end panel */}

					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">Gemini Information</h3>
						</div>
						<div className="panel-body">
							{this.panelRow("Country","country",e.PCountry)}
							{this.panelRow("Hire Location","hireLoc",e.PLocation)}
							{this.panelRow("State","state",e.PState)}
							{this.panelRow("Company","company",e.PCompany)}
							{this.panelRow("Street Address","address",e.PAddress)}
							{this.panelRow("Department","department",e.PDepartment)}
							{this.panelRow("Permission","permissions",e.Permission)}
						</div>	
					</div> {/* end panel */}
					<div className="page-header">
						<h3>User Created Forms</h3>
					</div>
				</form>	
				{/* end component */}
				</div> 
			);
		}.bind(this));
		

		return (
			<div>
				<div className="modal fade" id="edit" tabIndex="-1" role="dialog" aria-labelledby="editEmployeeStatus">
				  <div className="modal-dialog modal-lg" role="document">
				    <div className="modal-content">
				      <div className="modal-header">
				        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				        <h4 className="modal-title" id="editEmployeeStatus">Employee Edit</h4>
				      </div>
				      <div className="modal-body">
				        {employee}
				        {/* Dynamic adding of user form data */}
				        <div className="userAddedForms"></div>
				      </div>
				      <div className="modal-footer">
				        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.removeAppend}>Close</button>
				        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.editEmployee}>Save changes</button>
				      </div>
				    </div>
				  </div>
				</div>
				<div ref="editedEmployee" id="editedEmployee"></div>
			</div>
		);
	}
});