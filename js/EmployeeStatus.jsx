var React = require('react');
var CommentBox = require('./CommentBox');
var intervalID;

/* To display the submitted Data */
module.exports = React.createClass({
	getInitialState: function() {
		return {
			data: [],
			search: '',
			EId: ''
		};
	},

	componentDidMount: function() {
		/* ToDo */
		var eStatus = this.refs.eStatus.getDOMNode();
		$(eStatus).css("display","none");
	},

	searchBar: function(id1, label, onclick) {
		return (
			<div className="row">
				<div className="col-xs-6">
					<label className="control-label">{label}</label>
					
					<input className="form-control input-sm" id={id1} ref={id1} onKeyUp={this.autoCompletion} onBlur={this.setEmployee} placeholder="Search for..." />
					<span className="btn-group">
						<button className="btn btn-primary btn-sm" id="getEmployee" ref="getEmployee" onClick={onclick}>Get Employee</button>
						<button className="btn btn-default btn-sm" onClick={this.reset}>Clear</button>
					</span>
					
				</div>
			</div>
		);
	},

	/* Sets the employee and Eid to pull all employee information */
	setEmployee: function() {
		var search = this.refs.searchEmployee.getDOMNode().value;
		this.setState({search: search});
		this.getEId(search);
	},

	reset: function() {
		/* Upon clearing, polling interupts and pauses until the next search. Comments are polled to appear in realtime. */
		clearInterval(intervalID);
		this.setState({search: ''});
		var eStatus = this.refs.eStatus.getDOMNode();
		var e = this.refs.searchEmployee.getDOMNode();
		$(eStatus).fadeOut("slow");
		$(e).val('');
	},

	/* Need to grab EId to access user created requirements */
	getEId: function(e) {
		$.ajax({
			type: 'GET',
			url: 'php/view.php?ename='+e,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({EId: data[0].EmployeeId});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});
	},

	/* As the user types, hit the server for autocompletion */
	autoCompletion: function(e) {
		var search = this.refs.searchEmployee.getDOMNode();
		$.ajax({
			type: "GET",
			url: "php/view.php?employee="+e.target.value,
			contentType: 'application/json',
			cache: true,
			success: function(data) {
				var a = JSON.parse(data);
				var e = [];
				for(var i = 0; i < a.length; i++) {
					e.push(a[i].firstName + ' ' + a[i].lastName);
				}
				$(search).autocomplete({
					source: e
				});
			},
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});
	},



	getEmployeeStatus: function() {
		var search = this.refs.searchEmployee.getDOMNode().value;
		var eStatus = this.refs.eStatus.getDOMNode();
		var out = this.refs.output.getDOMNode();
		var name = this.refs.employeeName.getDOMNode();
		var error = this.refs.outError.getDOMNode();
		var re = /[N\/A][n\/a]/;
		if(this.state.search === '') {
			//alert("An employee must be selected to verify status.");
			$(error).html(
				"<div class='alert alert-warning alert-dismissible'>" +
					"<button type='button' class='close' data-dismiss='alert' aria-label='close'>" +	
					"<span aria-hidden='true'>&times;</span></button>" +
					"<b>An employee must be selected to verify status.</b>" +
				"</div>"
			);
			return;
		}

		$.ajax({
			type: "GET",
			url: "php/view.php",
			data: {e: search, employeeid: this.state.EId},
			contentType: 'application/json',
			cache: false,
			success: function(data) {
				//console.log(data);
				var e = JSON.parse(data);
				if (e[0].firstName !== 'undefined') {
					$(eStatus).fadeIn("slow");
					$(name).html("<h2>" + e[0].firstName + ' ' + e[0].lastName + "</h2>");
					$(out).html(
						"<div class='row'>" +
							"<div class='col-xs-6'>" +
								"<ul class='list-group'>" +
									"<li class='list-group-item'>" +
										"<div class='row'>" + 
											"<div class='col-xs-6'>" +
												"<label class='control-label'><b>Employee ID:</b></label>" +
											"</div>" +
											"<div class='col-xs-6 wrapIt'>" +	
												this.state.EId +
											"</div>" +
										"</div>" +	
									"</li>" +
									"<li class='list-group-item'>" + 
										"<div class='row'>" + 
											"<div class='col-xs-6'>" +
												"<label class='control-label'><b>Position:</b></label>" +
											"</div>" +
											"<div class='col-xs-6 wrapIt'>" +	
												e[0].PTitle +
											"</div>" +
										"</div>" +
									"</li>" +
									"<li class='list-group-item'>" +
										"<div class='row'>" + 
											"<div class='col-xs-6'>" +
												"<label class='control-label'><b>Location:</b></label>" +
											"</div>" +
											"<div class='col-xs-6 wrapIt'>" +	
												e[0].PLocation + ", " + e[0].PState +
											"</div>" +
										"</div>" + 
									"</li>" +
									"<li class='list-group-item'>" +
										"<div class='row'>" + 
											"<div class='col-xs-6'>" +
												"<label class='control-label'><b>Start Date:</b></label>" +
											"</div>" +
											"<div class='col-xs-6 wrapIt'>" +	
												e[0].StartDate +
											"</div>" +
										"</div>" +  
									"</li>" +
								"</ul>" +
							"</div>" +
							"<div class='col-xs-6'>" +
								"<ul class='list-group'>" +
									"<li class='list-group-item'>" +
										"<div class='row'>" + 
											"<div class='col-xs-6'>" +
												"<label class='control-label'><b>Email:</b></label>" +
											"</div>" +
											"<div class='col-xs-6 wrapIt'>" +	
												e[0].Email +
											"</div>" +
										"</div>" +	
									"</li>" +
									"<li class='list-group-item'>" + 
										"<div class='row'>" + 
											"<div class='col-xs-6'>" +
												"<label class='control-label'><b>Manager:</b></label>" +
											"</div>" +
											"<div class='col-xs-6 wrapIt'>" +	
												e[0].Manager +
											"</div>" +
										"</div>" +
									"</li>" +
									"<li class='list-group-item'>" +
										"<div class='row'>" + 
											"<div class='col-xs-6'>" +
												"<label class='control-label'><b>Department:</b></label>" +
											"</div>" +
											"<div class='col-xs-6 wrapIt'>" +	
												e[0].PDepartment +
											"</div>" +
										"</div>" + 
									"</li>" +
									"<li class='list-group-item'>" +
										"<div class='row'>" + 
											"<div class='col-xs-6'>" +
												"<label class='control-label'><b>End Date:</b></label>" +
											"</div>" +
											"<div class='col-xs-6 wrapIt'>" +	
												e[0].EndDate +
											"</div>" +
										"</div>" +  
									"</li>" +
								"</ul>" +
							"</div>" +
						"</div>" +			
						"<br />" +
						"<div class='row'> " +
							"<div class='col-xs-12'>" +
								"<label class='control-label'><b>Requirements Complete</b></label>" +
								"<div class='progress'>" +
	  								"<div class='progress-bar progress-bar-success progress-bar-striped active' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='0'>" +
	    								"<span class='sr-only'>% Complete (success)</span>" +
	    								"<b>" + Math.floor((e[1].ReqCount/e[2].TotalCount) * 100) + "%</b>" +
	  								"</div>" +
								"</div>" +
							"</div>" +	
						"</div>"
						);
						$(out).append(
						"<div class='well well-sm'><center><h3>Checklist Complete</h3></center></div>" +
						"<div class='row'>" +
							"<div class='col-xs-4'>" +
								"<h4><u>Department Responsible</u></h4>" +
							"</div>" +
							"<div class='col-xs-4'>" +
								"<h4><u>Requirement</u></h4>" +
							"</div>" +
							"<div class='col-xs-4'>" +
								"<h4><u>Date Completed</u></h4>" +
							"</div>" +	
						"</div>"
						); 
						for (var i = 3; i < e.length; i++) {
							if (!e[i].Value.match(re)) {
								$(out).append(
									"<div class='row'>" +
										"<div class='col-xs-4'>" +
											"<b>" + e[i].Department +"</b>" +
										"</div>" +
										"<div class='col-xs-4'>" +
											"<i class='wrapIt'>" + e[i].Requirement +"</i>" +
										"</div>" +
										"<div class='col-xs-4'>" +
											"<b style='color:#5cb85c;'>" + e[i].Date +"</b>" +
										"</div>" +		
									"</div>"
								);
							}	
						}	
						$(out).append(
							"<br />" +
						"<div class='well well-sm'><center><h3>Checklist TODO</h3></center></div>" +
						"<div class='row'>" +
							"<div class='col-xs-4'>" +
								"<h4><u>Department Responsible</u></h4>" +
							"</div>" +
							"<div class='col-xs-4'>" +
								"<h4><u>Requirement</u></h4>" +
							"</div>" +
							"<div class='col-xs-4'>" +
								"<h4><u>Date Submitted</u></h4>" +
							"</div>" +	
						"</div>"
						); 
						for (var i = 3; i < e.length; i++) {
							if (e[i].Value.match(re)) {
								$(out).append(
									"<div class='row'>" +
										"<div class='col-xs-4'>" +
											"<b>" + e[i].Department +"</b>" +
										"</div>" +
										"<div class='col-xs-4'>" +
											"<i class='wrapIt'>" + e[i].Requirement +"</i>" +
										"</div>" +
										"<div class='col-xs-4'>" +
											"<b style='color:#d9534f;'>" + e[i].Date +"</b>" +
										"</div>" +		
									"</div>"
								);
							}	
						}	
					
		
					/* Main progress bar to determine how many requirements are left */
					$('.progress-bar').each(function() {
						var min = $(this).attr('aria-valuemin', 0);
						var max = $(this).attr('aria-valuemax', e[2].TotalCount);
						var now = $(this).attr('aria-valuenow', e[1].ReqCount);
						var total = (e[1].ReqCount/e[2].TotalCount) * 100;
						$(this).css('width', total+'%');
					});
				}
				else {
					console.log("Wtf is going on");
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(xhr, status, err.toString());
			}
		});
	},

	render: function() {
		return (
			<div>
				{this.searchBar("searchEmployee","Employee Search",this.getEmployeeStatus)}
				<br />
				<div id="outError" ref="outError"></div>
				<div id="eStatus" ref="eStatus" className="panel panel-primary">
					<div className="panel-heading">
						<div className="panel-title">
						<h4 id="employeeName" ref="employeeName"></h4>
						</div>
					</div>
					<div id="output" ref="output" className="panel-body">
					</div>
					<div id="statusComments" ref="statusComments" className="panel-footer">
						<CommentBox name={this.state.search} pollInterval={3000} />
					</div>
				</div>
			</div>
		);
	}
});