/** @jsx React.DOM */

var React = require('react');
var AddForm = require('./AddForm');
var EmployeeList = require('./EmployeeList');
var ElmForm = require('./ElmForm');
var EmployeeStatus = require('./EmployeeStatus');
var SVGChart = require('./SVGChart');

/************************** ELM Related classes ************************/

var intervalID;
/* Maps Employee first and last name with the employeeId in the autocompletion function in <AddForm /> */
var employeeMap = new Map();


var Admin = React.createClass({
	loadEmployees: function() {
		$.ajax({
			url: "php/response.php",
			dataType: "json",
			type: "GET",
			cache: false,
			success: function(data) {
				this.setState({data: data});
				clearInterval(intervalID);
			}.bind(this),
			error: function(xhr, status, err) {
	 			console.error(xhr, status, err.toString());
	 		}.bind(this)
		});
	},

	getInitialState: function() {
		return {
		  email: false,
		  question: false,
		  submitted: null,
		  data: [],
		  
		};
	},
	/* Loaded after initial render; grabs employees for Employee List */
	componentDidMount: function() {
		this.loadEmployees();
	},

 	/* User/employee creation */
 	handleSubmit: function(data) {
 		
 		if (this.refs.elmForm.isValid()) {
	 		$.ajax({
	 			url: 'php/response.php',
	 			dataType: 'json',
	 			type: 'POST',
	 			data: this.refs.elmForm.getFormData(),
	 			success: function(data) {
					this.setState({submitted: data});
					this.refs.elmForm.clearData();
	 			}.bind(this),
	 			error: function(xhr, status, err) {
	 				console.error(xhr, status, err.toString());
	 			}.bind(this)
	 		});
 		}
 	},
	render: function() {

		var submitted;
		if (this.state.submitted !== null) {
		  	submitted = <div className="alert alert-success">
		    <p>Successful employee creation!</p>
		    <pre><code>{JSON.stringify(this.state.submitted, null, '  ')}</code></pre>
		  </div>
		}

		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-sm-3 col-md-2 sidebar">
					  <ul className="nav nav-sidebar" role="tablist">
					    <li role="presentation" className="active"><a href="#overview" aria-controls="overview" role="tab" data-toggle="tab">Overview <span className="sr-only">(current)</span></a></li>
					    <li role="presentation"><a href="#users" aria-controls="users" role="tab" data-toggle="tab">Add Employee</a></li>
					    <li role="presentation"><a href="#addForm" aria-controls="addForm" role="tab" data-toggle="tab">Form Manager</a></li>
					    <li role="presentation"><a href="#employeeList" aria-controls="employeeList" role="tab" data-toggle="tab" onClick={this.loadEmployees}>Employee List</a></li>
					    <li role="presentation"><a href="#employeeStatus" aria-controls="employeeStatus" role="tab" data-toggle="tab">Employee Status</a></li>
					    <li role="presentation"><a href="#offboard" aria-controls="offboard" role="tab" data-toggle="tab">Employee Offboarding</a></li>
					  </ul>
					  
					</div>
					<div className="tab-content col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
						<div className="" role="tabpanel" className="tab-pane active" id="overview">
							<h1 className="page-header">ELM Dashboard</h1>
							<p>
								<b>Session Storage: </b><span id="session"></span>
							</p>
						<div className="row">
							    <div className="col-xs-6 col-sm-3 ">
							      
							    </div>
							    <div className="col-xs-6 col-sm-3 ">
							      
							    </div>
							    <div className="col-xs-6 col-sm-3 ">
							      
							    </div>
							    <div className="col-xs-6 col-sm-3 ">
							      
							    </div>
						  </div>
						</div>
						<div role="tabpanel" className="tab-pane" id="users">
							<h1 className="page-header">Add New Employee</h1>
							<ElmForm ref="elmForm"
							    email={this.state.email}
							    question={this.state.question}
							    data={this.state.data}
							    top="Back to Top"
							    />
							<div className="row">
								<div className="col-xs-4"></div>
								<div className="col-xs-4">
									<button type="button" className="btn btn-primary btn-block" onClick={this.handleSubmit}>Submit</button>
								</div>
								<div className="col-xs-4"></div>
							</div>
							{submitted}
						</div>
						<div role="tabpanel" className="tab-pane" id="addForm">
							<h1 className="page-header">Form Manager</h1>
							<AddForm />
						</div>
						<div role="tabpanel" className="tab-pane" id="employeeList">
							<h1 className="page-header">Employee List</h1>
							<EmployeeList data={this.state.data} />
						</div>
						<div role="tabpanel" className="tab-pane" id="employeeStatus">
							<h1 className="page-header">Employee Status</h1>
							<EmployeeStatus />
						</div>
						<div role="tabpanel" className="tab-pane" id="offboard">
							<h1 className="page-header">Employee Offboarding</h1>
						</div>
					</div>
				</div>
			</div>	
		);
	},

	handleChange: function(field, e) {
	    var nextState = {}
	    nextState[field] = e.target.checked
	    this.setState(nextState)
	},
 
  	outputData: function() {
	    if (this.refs.elmForm.isValid()) {
	      this.setState({submitted: this.refs.elmForm.getFormData()});
	    }
  	}
});

$(document).ready(function() {
	document.cookie = "adAuthenticate=1";
	sessionStorage.setItem('auth', 4);
	React.render(<Admin />, document.getElementById('adminDisplay'));
	var data = sessionStorage.getItem('auth');
	$("#session").html(data);


});
	
