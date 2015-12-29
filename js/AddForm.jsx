var React = require('react');
var OPTIONS = require('./options');
var employeeMap = new Map();
var intervalID;

module.exports = React.createClass({
	/*
		FormName: Name of the form being created
		CurrentForms: The forms which users created
		PulledForm: The user generated form which is going to be filled in
		TheForm: The data structure to hold all form field characteristics(type, id, label, values),
		EditableForm: The form which is being edited,
		Employee: The employee which is pulled from the server to fill out a user generated form,
		EmployeeID: An employee's ID,
		Department: Each department can be associated with a form,
		currentOptions: Options which users can add to radio, checkbox or select form fields,
		formFieldType: the type of the form,
		AllFields: The data structure to hold all form field characteristics(type, id, label, values) 
	*/
	getInitialState: function() {
		return {
			FormName: '',
			CurrentForms: [],
			PulledForm: '',
			TheForm: [],
			EditableForm: [],
			Employee: '',
			EmployeeID: '',
			Department: '',
			currentOptions: [],
			currentOptions2: [],
			formFieldType: '',
			formFieldType2: '',
			AllFields: [],
			EditDepartment: '',
			showResults: false,
			done: false
		}
	},

	loadForms: function() {
		$.ajax({
			url: "php/view.php?loadforms",
			dataType: "json",
			type: "GET",
			cache: false,
			contentType: "application/json; charset=utf-8",
			success: function(data) {
				this.setState({CurrentForms: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});
	},

	componentDidMount: function() {
		/* hide submit button until a form appears */
		$(".hideIt").css("display","none");
		$(".addToEditForm").css("display","none");
		$(".fieldOptions").css("display", "none");
		$(".fieldOptions2").css("display", "none");
		/* If the component mounts, pull all available forms */
		this.loadForms();
	},

	/* Store form in database */
	saveForm: function() {
		// If there is no form name and/or fields, return an error
		/* Remove the form name tags */
		var error = this.refs.formSubmitError.getDOMNode();
		var dept = this.refs.department.getDOMNode().value;

		if(this.state.FormName === '' || this.state.AllFields.length < 1) {
			this._alert(error,'The form must have a name prior to submission and must have form fields.','alert-danger')
			return;
		}
		if (dept === '') {
			$(".selectDept").addClass('has-error');
			$(".addDepartmentErrorHelpBlock")
				.fadeIn("slow")
				.html("A department must be specified before the form can be submitted.")
				.css("color","red");
			return;
		}
		
		$.ajax({
			url: 'php/view.php',
			type: 'POST',
			dataType: 'json',
			data: {formData: this.state.AllFields, formname: this.state.FormName, department: dept},
			cache: false,
			success: function(data) {
				/* Clear state; keep forms */
				this.replaceState(
					{
						FormName: '',
						CurrentForms: this.state.CurrentForms,
						PulledForm: '',
						TheForm: [],
						EditableForm: [],
						currentOptions: [],
						AllFields: []
					}
				);
				$(".hideForm").fadeOut("slow");
				$(".selectDept").removeClass('has-error');
				$(".addDepartmentErrorHelpBlock").fadeOut("slow")
				/* Output validating message on success */
				this._alert(error, 'Successfully created the following form: ','alert-success',data);
				
				/* Load new form for realtime update */
				this.loadForms();

			}.bind(this),
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});
		React.findDOMNode(this.refs.department).value = '';
	},

	/* Pull stored form fields */
	getForm: function(e) {
		//TODO
		$.ajax({
			url: 'php/view.php?getform='+e,
			type: 'GET',
			dataType: 'json',
			cache: false,
			success: function(data) {
				//console.log(data);
				this.replaceState({
					FormName: '',
					CurrentForms: this.state.CurrentForms,
					PulledForm: '',
					TheForm: [],
					EditableForm: [],
					Employee: this.state.Employee,
					EmployeeId: this.state.EmployeeId,
					AllFields: [],
					currentOptions2: this.state.currentOptions2
				});
				/* Set the state of all relevant Form fields */
				this.setState({PulledForm: data[0].FormName});
				this.setState({Department: data[0].Department});
				/* Need to parse out field values as they are string objs. */
				try {
					for(var i = 0; i < data.length; i++) {
						data[i].FieldValues = JSON.parse(data[i].FieldValues);
					}
				} catch (e) {/* One set of values may be undefined; pass */}
			
				this.setState({TheForm: data});
				$(".hideIt").css("display","inline");
				$(".employeePull").fadeIn("slow");
				$(".hideForm").fadeOut("slow");
				$(".addToEditForm").css("display","none");
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});
	},

	/*Add fields to a form which is being edited */
	addEditFields: function() {
		var addedField = this.refs.addEditField.getDOMNode().value;


		/* User forgets to enter a name of the field */
		if (addedField === '' || this.state.formFieldType2 === '') {
			this._alert("#editErrorMsg",'The field requires a <i>name</i> and a <i>type</i> to be submitted.' ,'alert-danger');
			return;
		}
	
		
		$.ajax({
			url: 'php/view.php',
			type: 'POST',
			dataType: 'json',
			data: {
				addField: addedField, 
				formname: this.state.PulledForm, 
				dept: this.state.EditDepartment,
				fieldtype: this.state.formFieldType2,
				opts: JSON.stringify(this.state.currentOptions2)
			},
			cache: false,
			success: function(data) {
				console.log(data);
				/* Success msg */
				this._alert("#editErrorMsg",'Successfully added a new form field.','alert-success');
				this.setState({currentOptions2: []});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});
		React.findDOMNode(this.refs.addEditField).value = '';
		React.findDOMNode(this.refs.editInputTypes).value = '';
	},

	/* Pulls all elements of a selected form */
	editForm: function(e) {
		$(".hideIt").css("display","none");
		$.ajax({
			url: 'php/view.php?editform='+e,
			type: 'GET',
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.replaceState(
					{
						FormName: '',
						CurrentForms: this.state.CurrentForms,
						TheForm: [],
						PulledForm: '',
						EditableForm: [],
						AllFields: [],
						currentOptions2: this.state.currentOptions2
					}
				);
				this.setState({EditDepartment: data[0].Department});
				this.setState({PulledForm: data[0].FormName});
				this.setState({EditableForm: data});
				$(".hideForm").fadeOut("slow");
				$(".employeePull").fadeOut("slow");
				$(".addToEditForm").fadeIn("slow");
				//console.log(data);
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});
	},

	/* Ajax call to pull requirements and auto-fill the user generated form. 
	   When a user sets the employee to fill the form; if data already exists; fill the form
	*/
	pullRequirementValues: function(e) {
		var elem = this.refs.frmMain.getDOMNode().elements;
		/* Array containing the values */
		var vals = [];

		$.ajax({
			url: 'php/view.php',
			type: 'GET',
			dataType: 'json',
			data: {
				empid: e, 
				pulledform: this.state.PulledForm
			},
			cache: false,
			success: function(data) {
				//console.log(data);	
			
				for (var i = 0; i < data.length; i++) {
					for (var j = 0; j < elem.length; j++) {
						switch (elem[j].type) {
							case "checkbox":
								try {
									/* Parse out checkbox values */
									var val = JSON.parse(data[i].Value);
									/* If the id's match continue */
									if (data[i].Requirement === elem[j].name) {
										var x = document.getElementsByName(elem[j].name);
										/* Loop through the parsed values and see if they match the form id's */
										for (var p = 0; p < val.length; p++) {
											/* If they match, loop through all checkbox values and assign checks corresponding to the vals */
											if (elem[j].value === val[p]) {
												for (var k = 0; k < x.length; k++) {
													if (x[k].value === val[p]) {
														x[k].checked = true;
													}
												}
											}
										}
									}
								} catch (e) { /* Check for singluar values */
									if (data[i].Requirement === elem[j].name) {
										var x = document.getElementsByName(elem[j].name);
										if (data[i].Value.length === 1 || data[i].Value === 'N/A') {
											for (var k = 0; k < x.length; k++) {
												if (data[i].Value === x[k].value) {
													x[k].checked = true;
												}
											}
										}
									}
								}
								break;
							case "radio":
								if (data[i].Requirement === elem[j].name) {
									var x = document.getElementsByName(elem[j].name);
									if (elem[j].value === data[i].Value) {
										for (var k = 0; k < x.length; k++) {
											if (x[k].value === data[i].Value) {
												x[k].checked = true;
											}
										}
									}
								}
								break;	
							case "select-one":
								if (data[i].Requirement === elem[j].id) {
									document.getElementById(elem[j].id).value = data[i].Value;	
								}
								break;
							case "textarea":
								if (data[i].Requirement === elem[j].id) {
									document.getElementById(elem[j].id).value = data[i].Value;
								}
								break;	
							case "text":
								if (data[i].Requirement === elem[j].id) {
									document.getElementById(elem[j].id).value = data[i].Value;
								}
								break;				
						}
					}
				}
			},
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});
	},

	/* Submit a user created form */
	submitForm: function() {
		/* All user form elements */
		var elem = this.refs.frmMain.getDOMNode().elements;
		var e = this.state.EmployeeId;
		var submitSuccess = this.refs.formSubmitSuccess.getDOMNode();
		var err = this.refs.submitError.getDOMNode();
		var pullEmployee = this.refs.pullEmployee.getDOMNode();
		var obj = {};
		var AllFields = [];
		var checkedValues = [];
		var count = 0;

		/* If an employee has not been selected; alert and return */
		if (this.state.EmployeeId === '' || this.state.EmployeeId === undefined) {
			$(".addEmployeeError").addClass('has-error');
			$(".addEmployeeErrorHelpBlock")
				.fadeIn("slow")
				.html("An employee must be specified before the form can be submitted.")
				.css("color","red");
			return;
		}
		
		/* Store values and requirements */
		for(var i = 0; i < elem.length; i++) {
			if (elem[i].type === "button" || elem[i].type === "reset") {
				// Do nothing
			} else if(elem[i].type === "checkbox") {
				/* Push all checked values into another array, serialize for storing in db */
				if (elem[i].checked === true) {
					if (document.querySelectorAll('input[name="'+elem[i].name+'"]:checked').length >= 1) {
						obj.Id = elem[i].name;
						obj.Type = elem[i].type;
						obj.Vals = elem[i].value
						AllFields = AllFields.concat(obj);
						obj = {}; 			
					}
				} else if (elem[i].checked === false && document.querySelectorAll('input[name="'+elem[i].name+'"]:checked').length < 1){
					this._alert(submitSuccess, 'Please select a value for: ', 'alert-danger', elem[i].name);
					return;
				}
			} else if (elem[i].type === "radio") {
				if (elem[i].checked === true) {
					obj.Id = elem[i].name;
					obj.Type = elem[i].type;
					obj.Vals = elem[i].value;
					AllFields = AllFields.concat(obj);
					obj = {};
				} else if (elem[i].checked === false && document.querySelectorAll('input[name="'+elem[i].name+'"]:checked').length < 1) {
					this._alert(submitSuccess, 'Please select a value for: ', 'alert-danger', elem[i].name);
					return;
				}
			} else if (elem[i].type === "select-one") {
				if (elem[i].value === "") {
					obj.Id = elem[i].id;
					obj.Type = elem[i].type;
					obj.Vals = 'N/A';	
					AllFields = AllFields.concat(obj);
					obj = {};	
				} else {		
					obj.Id = elem[i].id;
					obj.Type = elem[i].type;
					obj.Vals = elem[i].value;	
					AllFields = AllFields.concat(obj);
					obj = {};
				}		
			} else {
				if (elem[i].value === "") {
					obj.Id = elem[i].id;
					obj.Type = elem[i].type;
					obj.Vals = 'N/A'; // Default to N/A
					AllFields = AllFields.concat(obj);
					obj = {};
				} else {
					obj.Id = elem[i].id;
					obj.Type = elem[i].type;
					obj.Vals = elem[i].value;
					AllFields = AllFields.concat(obj);
					obj = {};
				}	
			}
		}
		/* Stores checked values */
		var checks = []; 

		/* 
			Clean up: Loop through stored objs and remove any redundancies created by storing checkbox values
			CHECKBOX INFO: Can currently only store two checked fields within one array; 
			if there are more than two checked fields, they are stored in their own obj 
		*/
		/* First filter */		
		for (var i = 0; i < AllFields.length; i++) {
			if (AllFields[i].Type === 'checkbox') {
				if (i === AllFields.length - 1) {
					break;
				} 
				if (AllFields[i].Id === AllFields[i + 1].Id) {
					/* if the indexed value of each field >= 3 */
					try {
						if (AllFields[i].Id === AllFields[i + 2].Id) {
							checks.push(AllFields[i + 2].Vals);	
						}
						checks.push(AllFields[i].Vals);
						checks.push(AllFields[i + 1].Vals);
						AllFields[i].Vals = JSON.stringify(checks);
					} catch (e) { /* Else there are probably not more fields */
						checks.push(AllFields[i].Vals);
						checks.push(AllFields[i + 1].Vals);
						AllFields[i].Vals = JSON.stringify(checks);
					}
					if (AllFields[i].Id === AllFields[i + 1].Id && AllFields[i+1].Vals.length === 1) {
						//console.log("Ids match and length is 1: " + AllFields[i + 1].Id);
						AllFields.splice(i+1, 1);
					}
				} 
				checks = [];
			}
		}
		/* Second filter */
		for (var i = 0; i < AllFields.length; i++) {
			if (AllFields[i].Type === 'checkbox') {
				if (i === AllFields.length - 1) {
					break;
				}
				if (AllFields[i].Id === AllFields[i + 1].Id && AllFields[i+1].Vals.length === 1) {
					AllFields.splice(i+1, 1);
				} 
			}
		}

		
		$.ajax({
			url: 'php/view.php',
			type: 'POST',
			dataType: 'json',
			data: {allVals: AllFields, employee: e, form: this.state.PulledForm, dept: this.state.Department},
			cache: false,
			success: function(data) {
				//console.log(data);
				// Case 1: User exists and info is updated 
				if (data[0] === 1) {
					this._alert(submitSuccess, 'Successfully updated user information from the form: ', 'alert-success', data[1]);
				} else {
					this._alert(submitSuccess, 'Successfully submitted the form: ', 'alert-success', data[1]);
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});

		/* Clear the form after submission */
		for(var i = 0; i < elem.length; i++) {
			elem[i].value = '';
			if (elem[i].checked === true) {
				elem[i].checked = false;
			}
		}
	},

	/* Pass in on filter function; If */
	isBigEnough: function(obj) {
		return obj.Vals.length > 1;
	},	

	/* Delete field from form while editing */
	deleteField: function(e) {
		$.ajax({
			url: 'php/view.php?deletefield='+e,
			type: 'GET',
			data: {editFormName: this.state.PulledForm},
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({EditableForm: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});
	},

	/* Deletes a form */
	deleteForm: function(e) {
		$.ajax({
			url: 'php/view.php?deleteform='+e,
			type: 'POST',
			dataType: 'json',
			cache: false,
			success: function(data) {
				/* Clear any previous form on screen; in the case the user still had the deleted form up */
				this.replaceState(
					{
						FormName: '',
						CurrentForms: this.state.CurrentForms,
						TheForm: [],
						PulledForm: '',
						EditableForm: [],
						AllFields: [],
					}
				);
				this.loadForms();
				$(".hideIt").fadeOut("slow");
				$(".addToEditForm").fadeOut("slow");
				$(".employeePull").fadeOut("slow");
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(xhr, status, err.toString());
			}
		});
	},

	/* Hit server to find employee as user types to set the state of an employee */
	autoCompletion: function(e) {
		var search = this.refs.pullEmployee.getDOMNode();
		$.ajax({
			type: "GET",
			url: "php/view.php?employee="+e.target.value,
			contentType: 'application/json',
			cache: true,
			success: function(data) {
				var a = JSON.parse(data);
				var e = [];
				for(var i = 0; i < a.length; i++) {
					employeeMap.set(a[i].firstName + ' ' + a[i].lastName, a[i].EmployeeId);
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

	_alert: function(selector, str, alertType, opts) {
		if (opts === undefined) {
			return (
				$(selector)
				.fadeIn("slow")
				.html(
					"<br /><div class='alert "+alertType+" alert-dismissible' role='alert'>" +
						"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
							"<span aria-hidden='true'>&times;</span></button>" +
						"<h5><b>" + str + "</b></h5>" +
					"</div>"
				)
			);
		} else {
			return (
				$(selector)
				.fadeIn("slow")
				.html(
					"<br /><div class='alert "+alertType+" alert-dismissible' role='alert'>" +
						"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
							"<span aria-hidden='true'>&times;</span></button>" +
						"<h5><b>" + str +"<i>"+opts+"</i></b></h5>" +
					"</div>"
				)
			);
		}
	},

	/* On click of the field, drop it */
	dropField: function(e) {
		var formField = this.state.AllFields;
		var index = formField.indexOf(e);
		/* Find particular location of field and remove it */
		if (index > -1) {
			formField.splice(index, 1);
		}
		this.setState({AllFields: formField});
		//console.log(this.state.AllFields);
	},

	/* Drops options from checkbox, radio or select inputs when creating form fields */
	/* Params: e(Value), this.state.currentOptions, this.state.formFieldType, state*/
	dropOption: function(e, curOpts, formFieldType, state) {
		/* Placeholder for any created options */
		var currentOption = curOpts;
		if (formFieldType === 'checkbox') {
			var index = currentOption.indexOf(e);
			if (e !== 'N/A') {
				if (index > -1) {
					currentOption.splice(index, 1);
				}
				this.setState({state: currentOption});
			}
		}
		if (formFieldType === 'radio') {
			var index = currentOption.indexOf(e);
			if (e !== 'N/A') {
				if (index > -1) {
					currentOption.splice(index, 1);
				}
				this.setState({state: currentOption});
			}
		}
		if (formFieldType === 'select') {
			var index = currentOption.indexOf(e);
			if (e !== 'N/A') {
				if (index > -1) {
					currentOption.splice(index, 1);
				}
				this.setState({state: currentOption});
			}
		}
	},
	
	/* Displays the fields that the user creates when they are initializing a form */
	displayCurrentFields: function() {
		var fields = this.state.AllFields.map(function(f) {
			return (
				<div className="col-xs-4">
					<div key={f} className="alert alert-success" role="alert" onClick={this.dropField.bind(this, f)}>
						Name: <b>{f.Label}</b><br />
						Type: <b>{f.Type}</b><br />
						Values: <b>{f.Values}</b><br />
						Permission: <b>{f.Permission}</b>
					</div>
				</div>	
			)
		}.bind(this));
		return (
			<div>
				<div className="row">
					{fields}
				</div>
				<div className="row">
					<p className="help-block hideForm">To remove a field, click it!</p>	
				</div>
			</div>		
		)
	},

	/* Display the form the user would like to edit */
	displayEditForm: function() {
		var formfields = this.state.EditableForm.map(function(f) {
			return (
				<div className="col-xs-4">
					<div key={f.FieldId} className="alert alert-info" role="alert" onClick={this.deleteField.bind(this, f.FieldId)}>
						Name: <b>{f.Label}</b><br />
						Type: <b>{f.Type}</b><br />
						Values: <b className="wrapIt">{f.FieldValues}</b>
					</div>
				</div>	
			)
		}.bind(this));
		return (
			<div>
				<div className="row">
					{formfields}
				</div>
				<div className="row">
					<div className="col-sm-6 addToEditForm">
						<p className="help-block">To remove a field from the form. Click it!</p>
						<label className="control-label">Enter Field Name</label>
						<input type="text" id="addEditField" ref="addEditField" className="form-control input-sm" placeholder="Add New Field..." />
						{this.renderSelect("editInputTypes","Field Type", OPTIONS.TYPES, "Select Field Type",this.setFieldType2)}
					    
						<div className="input-group fieldOptions2">
						    <input type="text" id="addOptions2" ref="addOptions2" className="form-control input-sm" placeholder="Enter options..." />
						    <span className="input-group-btn">
						    	<button className="btn btn-default btn-sm" type="button" onClick={this.addOption2}>Add option</button>
						    </span>
					    </div>
					    <div id="fieldDisplayOptions" ref="fieldDisplayOptions" className="thumbnail fieldOptions2">{this.displayOptionFields(this.state.currentOptions2, this.state.formFieldType2)}</div>

						<button className="btn btn-default btn-sm" type="button" onClick={this.addEditFields}>Add Field</button>
						<div id="editErrorMsg" ref="editErrorMsg"></div>
					</div>
				</div>
			</div>	
		)
	},
 	
 	checks: function() {
 		alert("In checks");
 	},

	/* Displays a user generated form pulled from the server*/
	displayForm: function() {
		var userPermission = sessionStorage.getItem('auth');
		var form = this.state.TheForm.map(function(i) {
			var permission = parseInt(i.Permission, 10);
			if (i.Type === 'checkbox') {
				if (permission < userPermission) {
					var checks = i.FieldValues.map(function mapChecks(value) {
				      return <label className="radio-inline">{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}
				        <input type={i.Type} ref={i.FieldId} name={i.FieldId} value={value} readOnly />
				        {"\u00a0"}{"\u00a0"}{"\u00a0"}{value}
				      </label>
				    })
				    return (
				    	<div className="form-group">
				    		<h4><label className="label label-default" htmlFor={i.FieldId}>{i.Label}</label></h4>
					    	<div key={i.FieldId} className="checkbox">
								{checks}
							</div>
						</div>	
				    )	
				} else {
					var checks = i.FieldValues.map(function mapChecks(value) {
				      return <label className="radio-inline">{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}
				        <input type={i.Type} ref={i.FieldId} name={i.FieldId} value={value} />
				        {"\u00a0"}{"\u00a0"}{"\u00a0"}{value}
				      </label>
				    })
				    return (
				    	<div className="form-group">
				    		<h4><label className="label label-default" htmlFor={i.FieldId}>{i.Label}</label></h4>
					    	<div key={i.FieldId} className="checkbox">
								{checks}
							</div>
						</div>	
				    )
				}
			} else if(i.Type === 'radio') {
				if (permission < userPermission) {
					var radios = i.FieldValues.map(function mapRadios(value) {
				      return <label className="radio-inline">{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}
				        <input type={i.Type} ref={i.FieldId} name={i.FieldId} value={value} readOnly />
				        {"\u00a0"}{"\u00a0"}{"\u00a0"}{value}
				      </label>
				    })
				    return (
				    	<div key={i.FieldId} className="form-group">
							<h4><label className="label label-default" htmlFor={i.FieldId}>{i.Label}</label></h4>
							{radios}
						</div>
				    )
				} else {
					var radios = i.FieldValues.map(function mapRadios(value) {
				      return <label className="radio-inline">{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}
				        <input type={i.Type} ref={i.FieldId} name={i.FieldId} value={value} />
				        {"\u00a0"}{"\u00a0"}{"\u00a0"}{value}
				      </label>
				    })
				    return (
				    	<div key={i.FieldId} className="form-group">
							<h4><label className="label label-default" htmlFor={i.FieldId}>{i.Label}</label></h4>
							{radios}
						</div>
				    )
				}
			} else if(i.Type === 'select') {
				if (permission < userPermission) {
					var options = i.FieldValues.map(function mapSelect(value) {
						return <option key={value} value={value}>{value}</option>
					})
					return (
						<div key={i.FieldId} className="form-group">
							<h4><label className="label label-default" htmlFor={i.FieldId}>{i.Label}</label></h4>
							<select className="form-control input-sm" id={i.FieldId} ref={i.FieldId} readOnly>
								<option value="">Select Option</option>
								{options}
							</select>
						</div>
					)
				} else {
					var options = i.FieldValues.map(function mapSelect(value) {
						return <option key={value} value={value}>{value}</option>
					})
					return (
						<div key={i.FieldId} className="form-group">
							<h4><label className="label label-default" htmlFor={i.FieldId}>{i.Label}</label></h4>
							<select className="form-control input-sm" id={i.FieldId} ref={i.FieldId}>
								<option value="">Select Option</option>
								{options}
							</select>
						</div>
					)
				}
			} else if(i.Type === 'textarea') {
				if (permission < userPermission) {
					return (
						<div key={i.FieldId} className="form-group">
							<h4><label className="label label-default" htmlFor={i.FieldId}>{i.Label}</label></h4>
							<textarea className="form-control input-sm" ref={i.FieldId} id={i.FieldId} placeholder="Enter here..." readOnly ></textarea>
						</div>
					)
				} else {
					return (
						<div key={i.FieldId} className="form-group">
							<h4><label className="label label-default" htmlFor={i.FieldId}>{i.Label}</label></h4>
							<textarea className="form-control input-sm" ref={i.FieldId} id={i.FieldId} placeholder="Enter here..." ></textarea>
						</div>
					)
				}
			} else {
				if (permission < userPermission) {
					return (
						<div key={i.FieldId} className="form-group">
							<h4><label className="label label-default" htmlFor={i.FieldId}>{i.Label}</label></h4>
							<input type={i.Type} className="form-control input-sm" ref={i.FieldId} id={i.FieldId} placeholder="Enter here..." readOnly />
						</div>
					)
				} else {
					return (
						<div key={i.FieldId} className="form-group">
							<h4><label className="label label-default" htmlFor={i.FieldId}>{i.Label}</label></h4>
							<input type={i.Type} className="form-control input-sm" ref={i.FieldId} id={i.FieldId} placeholder="Enter here..." />
						</div>
					)
				}
			}
		})

		return (
			<div>
				<div className="row employeePull">
					<div className="col-xs-6">
						<div className="input-group addEmployeeError">
							<input type="text" id="pullEmployee" ref="pullEmployee" className="form-control input-sm" onKeyUp={this.autoCompletion} placeholder="Enter Employee Name..." />
							<span className="input-group-btn">
								<button className="btn btn-default btn-sm" type="button" onClick={this.setEmployee}>Set Employee</button>
							</span>
						</div>
						<p className="help-block addEmployeeErrorHelpBlock"></p>
					</div>
					<div id="submitError" ref="submitError"></div>
				</div>	
				<form id="frmMain" ref="frmMain">	
					<div className="row">
						<div className="col-sm-6">
							<ul className="list-group employeePull">
								<li className="list-group-item">	
									Employee: <span className="badge"><b>{this.state.Employee}</b></span>
								</li>
								<li className="list-group-item">	
									Employee Id: <span className="badge"><b>{this.state.EmployeeId}</b></span>
								</li>	
							</ul>
						</div>	
					</div>	
					<div className="page-header employeePull">
						<h4>Form: <b>{this.state.PulledForm}</b></h4>
						<span>Department: <b>{this.state.Department}</b></span>
					</div>
					{form}
					<button type="button" className="btn btn-primary btn-sm hideIt" onClick={this.submitForm}>Submit</button>
					<button type="reset" className="btn btn-default btn-sm hideIt">Clear</button>
				</form>
				<p className="help-block hideIt">** Please note, if any information cannot readily be entered, enter N/A. **</p>
				<div id="formSubmitSuccess" ref="formSubmitSuccess"></div>
			</div>	
		)
	},
	/* Sets the state of the employee, so when a user created form is submitted; it will have a corresponding employee attached to it */
	setEmployee: function() {
		var e = this.refs.pullEmployee.getDOMNode().value;
		var eid = employeeMap.get(e);
		/* Remove error */
		$(".addEmployeeError").removeClass('has-error');
		$(".addEmployeeErrorHelpBlock").fadeOut("slow");
		//console.log(eid);
		this.setState({Employee: e, EmployeeId: eid});
		React.findDOMNode(this.refs.pullEmployee).value = '';
		this.pullRequirementValues(eid);
	},

	/* Adds a field input to the form a user is creating */
	addField: function() {
		var labelInput = this.refs.fieldLabel.getDOMNode().value;
		var fieldType = this.refs.inputTypes.getDOMNode().value;
		var permission = this.refs.formPermissions.getDOMNode().value;
		/*  
			This obj will contain all form elements.
			All data will be pushed to AllFields
		*/
		var obj = {};
		var options = this.state.currentOptions;
		var error = this.refs.formSubmitError.getDOMNode();

		/* Initial validation to make sure the user is initializing a form; each input field should have a label and a type */
		if (this.state.FormName === '') {
			this._alert(error, 'Please initialize the form before adding fields.','alert-danger')
			return;
		}

		if (fieldType === '' || labelInput === '')  {
			this._alert(error, 'You must enter a <i>field name</i> and select a <i>field type.</i>','alert-danger')
			return;
		}
		/* All form fields to be saved are based around the field type; all data to be saved in this.state.AllFields */
		switch (this.state.formFieldType) {
			case 'checkbox':
				/* Use label as Id; if it can be split; split the string and concat together for unique ID */
				if (this.canSplit(labelInput,' ') === true) {
					var arr = labelInput.split(' ');
					var ID = arr.join('');
					
					obj.Id = ID;
					obj.Label = labelInput;
					obj.Type = this.state.formFieldType;
					obj.Values = JSON.stringify(this.state.currentOptions);
					obj.Permission = permission;

					this.setState({AllFields: this.state.AllFields.concat(obj)});
				}
				else {
					obj.Id = labelInput;
					obj.Label = labelInput;
					obj.Type = this.state.formFieldType;
					obj.Values = JSON.stringify(this.state.currentOptions);
					obj.Permission = permission;

					this.setState({AllFields: this.state.AllFields.concat(obj)});
				}
				break;
			case 'radio':
				if (this.canSplit(labelInput,' ') === true) {
					var arr = labelInput.split(' ');
					var ID = arr.join('');
					
					obj.Id = ID;
					obj.Label = labelInput;
					obj.Type = this.state.formFieldType;
					/* Add N/A as the default choice if a user does not have info readily available */
					this.setState({currentOptions: this.state.currentOptions.concat(['N/A'])})
					obj.Values = JSON.stringify(this.state.currentOptions);
					obj.Permission = permission;
					
					this.setState({AllFields: this.state.AllFields.concat(obj)});
				}
				else {
					obj.Id = labelInput;
					obj.Label = labelInput;
					obj.Type = this.state.formFieldType;
					this.setState({currentOptions: this.state.currentOptions.concat(['N/A'])})
					obj.Values = JSON.stringify(this.state.currentOptions);
					obj.Permission = permission;
					
					this.setState({AllFields: this.state.AllFields.concat(obj)});
				}
				break;

			case 'select':
				if (this.canSplit(labelInput,' ') === true) {
					var arr = labelInput.split(' ');
					var ID = arr.join('');
					
					obj.Id = ID;
					obj.Label = labelInput;
					obj.Type = this.state.formFieldType;
					obj.Values = JSON.stringify(this.state.currentOptions);
					obj.Permission = permission;
					
					this.setState({AllFields: this.state.AllFields.concat(obj)});
				}
				else {
					obj.Id = labelInput;
					obj.Label = labelInput;
					obj.Type = this.state.formFieldType;
					obj.Values = JSON.stringify(this.state.currentOptions);
					obj.Permission = permission;
					
					this.setState({AllFields: this.state.AllFields.concat(obj)});
				}
				break;
			case 'text':
				if (this.canSplit(labelInput,' ') === true) {
					var arr = labelInput.split(' ');
					var ID = arr.join('');
					
					obj.Id = ID;
					obj.Label = labelInput;
					obj.Type = this.state.formFieldType;
					obj.Values = JSON.stringify(this.state.currentOptions);
					obj.Permission = permission;

					this.setState({AllFields: this.state.AllFields.concat(obj)});
				}
				else {
					obj.Id = labelInput;
					obj.Label = labelInput;
					obj.Type = this.state.formFieldType;
					obj.Values = JSON.stringify(this.state.currentOptions);
					obj.Permission = permission;
					
					this.setState({AllFields: this.state.AllFields.concat(obj)});
				}
				break;
			case 'textarea':
				if (this.canSplit(labelInput,' ') === true) {
					var arr = labelInput.split(' ');
					var ID = arr.join('');
					
					obj.Id = ID;
					obj.Label = labelInput;
					obj.Type = this.state.formFieldType;
					obj.Values = JSON.stringify(this.state.currentOptions);
					obj.Permission = permission;

					this.setState({AllFields: this.state.AllFields.concat(obj)});
				}
				else {
					obj.Id = labelInput;
					obj.Label = labelInput;
					obj.Type = this.state.formFieldType;
					obj.Values = JSON.stringify(this.state.currentOptions);
					obj.Permission = permission;
					
					this.setState({AllFields: this.state.AllFields.concat(obj)});
				}
				break;
			default:
				break;		
		}
		/* Clear old input values after adding a field */
		React.findDOMNode(this.refs.fieldLabel).value = '';
		React.findDOMNode(this.refs.inputTypes).value = '';
		React.findDOMNode(this.refs.formPermissions).value = '';
		this.setState({currentOptions: []});
	},

	/* Set field type to checkbox, radio or select inputs; fade in the options input field */
	setFieldType: function() {
		var val = this.refs.inputTypes.getDOMNode().value;
		var NA = 'N/A';
		switch (val) {
			case 'checkbox':
				this.setState({formFieldType: 'checkbox'});
				$(".fieldOptions").fadeIn("slow");
				if (contains(this.state.currentOptions, 'N/A') === false) {
					this.setState({currentOptions: this.state.currentOptions.concat([NA])});
				} else {
					this.setState({currentOptions: []});
				}
				break;
			case 'radio':
				this.setState({formFieldType: 'radio'});
				//this.setState({currentOptions: []});
				$(".fieldOptions").fadeIn("slow");
				if (contains(this.state.currentOptions, 'N/A') === false) {
					this.setState({currentOptions: this.state.currentOptions.concat([NA])});
				} else {
					this.setState({currentOptions: []});
				}
				break;
			case 'select':
				this.setState({formFieldType: 'select'});
				$(".fieldOptions").fadeIn("slow");
				if (contains(this.state.currentOptions, 'N/A') === false) {
					this.setState({currentOptions: this.state.currentOptions.concat([NA])});
				} else {
					this.setState({currentOptions: []});
				}
				break;
			case 'text':
				this.setState({formFieldType: 'text'});
				this.setState({currentOptions: []});
				$(".fieldOptions").fadeOut("slow");
				break;
			case 'textarea':
				this.setState({formFieldType: 'textarea'});
				this.setState({currentOptions: []});
				$(".fieldOptions").fadeOut("slow");
				break;			
			default:
				this.setState({formFieldType: ''});
				this.setState({currentOptions: []});
				$(".fieldOptions").fadeOut("slow");
				break;		
		}
	},
	/* For EDIT: Adding form fields */
	setFieldType2: function() {
		var edit = this.refs.editInputTypes.getDOMNode().value;
		var NA = 'N/A';
		switch (edit) {
			case 'checkbox':
				this.setState({formFieldType2: 'checkbox'});
				$(".fieldOptions2").fadeIn("slow");
				if (contains(this.state.currentOptions2, 'N/A') === false) {
					this.setState({currentOptions2: this.state.currentOptions2.concat([NA])});
				} else {
					this.setState({currentOptions2: []});
				}
				break;
			case 'radio':
				this.setState({formFieldType2: 'radio'});
				$(".fieldOptions2").fadeIn("slow");
				if (contains(this.state.currentOptions2, 'N/A') === false) {
					this.setState({currentOptions2: this.state.currentOptions2.concat([NA])});
				} else {
					this.setState({currentOptions2: []});
				}
				break;
			case 'select':
				this.setState({formFieldType2: 'select'});
				$(".fieldOptions2").fadeIn("slow");
				if (contains(this.state.currentOptions2, 'N/A') === false) {
					this.setState({currentOptions2: this.state.currentOptions2.concat([NA])});
				} else {
					this.setState({currentOptions2: []});
				}
				break;
			case 'text':
				this.setState({formFieldType2: 'text'});
				this.setState({currentOptions2: []});
				$(".fieldOptions2").fadeOut("slow");
				break;
			case 'textarea':
				this.setState({formFieldType2: 'textarea'});
				this.setState({currentOptions2: []});
				$(".fieldOptions2").fadeOut("slow");
				break;			
			default:
				this.setState({formFieldType2: ''});
				this.setState({currentOptions2: []});
				$(".fieldOptions2").fadeOut("slow");
				break;		
		}
	},

	/* Displays the options of checkbox, radio or select form inputs */
	/* Params: this.state.currentOptions, this.state.formFieldType*/
	displayOptionFields: function(curOpts, formFieldType) {

		if (formFieldType === 'checkbox') {
			var options = curOpts.map(function(option) {
				return (
					<li className="list-group-item" onClick={this.dropOption.bind(this, option, curOpts, formFieldType, 'currentOptions')}>
						<b>{option}</b>
					</li>	
				)	
			}.bind(this));
			return (
				<div>
					<ul className="list-group">
						{options}
					</ul>	
					<p className="help-block">To remove a checkbox option, click it!</p>
					<p className="help-block">N/A will automatically be added to each radio or checkbox field.</p>
				</div>
			)
		}
		else if (formFieldType === 'radio') {
			var options = curOpts.map(function(option) {
				return (
					<li className="list-group-item" onClick={this.dropOption.bind(this, option, curOpts, formFieldType, 'currentOptions')}>
						<b>{option}</b>
					</li>
				)	
			}.bind(this));
			return (
				<div>
					<ul className="list-group">
						{options}
					</ul>	
					<p className="help-block">To remove a radio option, click it!</p>
					<p className="help-block">N/A will automatically be added to each radio or checkbox field.</p>
				</div>
			)
		}
		else if (formFieldType === 'select') {
			var options = curOpts.map(function(option) {
				return (
					<li className="list-group-item" onClick={this.dropOption.bind(this, option, curOpts, formFieldType, 'currentOptions')}>
						<b>{option}</b>
					</li>
				)	
			}.bind(this));
			return (
				<div>
					<ul className="list-group">
						{options}
					</ul>	
					<p className="help-block">To remove a select option, click it!</p>
				</div>
			)
		}
		else {
			return;
		}
	},

	/* Adds an option to a checkbox, radio, select  */
	/* Params: refVal(Id/Ref), formFieldType, curOpts, currentOptions */
	addOption: function() {
		var option = this.refs.addOptions.getDOMNode().value;
		var NA = 'N/A';
		
		if (this.state.formFieldType === 'checkbox') {
			if (option !== 'N/A' && contains(this.state.currentOptions, 'N/A') === false) {
				this.setState({currentOptions: this.state.currentOptions.concat([NA])});
				React.findDOMNode(this.refs.addOptions).value = '';
			} else {
				this.setState({currentOptions: this.state.currentOptions.concat([option])});
				React.findDOMNode(this.refs.addOptions).value = '';
			}
		} else if (this.state.formFieldType === 'radio') {
			if (option !== 'N/A' && contains(this.state.currentOptions, 'N/A') === false) {
				this.setState({currentOptions: this.state.currentOptions.concat([NA])});
				React.findDOMNode(this.refs.addOptions).value = '';
			} else {
				this.setState({currentOptions: this.state.currentOptions.concat([option])});
				React.findDOMNode(this.refs.addOptions).value = '';
			}
		} else if (this.state.formFieldType === 'select') {
			if (option !== 'N/A' && contains(this.state.currentOptions, 'N/A') === false) {
				this.setState({currentOptions: this.state.currentOptions.concat([NA])});
				React.findDOMNode(this.refs.addOptions).value = '';
			} else {
				this.setState({currentOptions: this.state.currentOptions.concat([option])});
				React.findDOMNode(this.refs.addOptions).value = '';
			}
		} else {
			return;
		}
	},

	addOption2: function() {
		var option2 = this.refs.addOptions2.getDOMNode().value;
		var NA = 'N/A';
		if (this.state.formFieldType2 === 'checkbox') {
			if (option2 !== 'N/A' && contains(this.state.currentOptions2, 'N/A') === false) {
				this.setState({currentOptions2: this.state.currentOptions2.concat([NA])});
				React.findDOMNode(this.refs.addOptions2).value = '';
			} else {
				this.setState({currentOptions2: this.state.currentOptions2.concat([option2])});
				React.findDOMNode(this.refs.addOptions2).value = '';
			}
		} else if (this.state.formFieldType2 === 'radio') {
			if (option2 !== 'N/A' && contains(this.state.currentOptions2, 'N/A') === false) {
				this.setState({currentOptions2: this.state.currentOptions2.concat([NA])});
				React.findDOMNode(this.refs.addOptions2).value = '';
			} else {
				this.setState({currentOptions2: this.state.currentOptions2.concat([option2])});
				React.findDOMNode(this.refs.addOptions2).value = '';
			}
		} else if (this.state.formFieldType2 === 'select') {
			if (option2 !== 'N/A' && contains(this.state.currentOptions2, 'N/A') === false) {
				this.setState({currentOptions2: this.state.currentOptions2.concat([NA])});
				React.findDOMNode(this.refs.addOptions2).value = '';
			} else {
				this.setState({currentOptions2: this.state.currentOptions2.concat([option2])});
				React.findDOMNode(this.refs.addOptions2).value = '';
			}
		} else {
			return;
		}
	},

	/* Initializes the user created form; fades it in, sets the state of the formname */
	initForm: function() {
		var error = this.refs.formSubmitError.getDOMNode();
		var formname = this.refs.formName.getDOMNode().value;		
		/* Client side validation check to make sure formnames are unique and that they have a name */
		if (formname === '' || formname === undefined) {
			this._alert(error, 'The form requires a name to be initialized.', 'alert-danger');
			return;
		}
		for (var i = 0; i < this.state.CurrentForms.length; i++) {
			if (formname === this.state.CurrentForms[i].FormName) {
				this._alert(error, "The Form: <i>" + this.state.CurrentForms[i].FormName + " </i>already exists. Create a new form, or update the existing one.",
					"alert-danger");
				return;
			}
		}
		/* Ensure there are no other active states while initializing a new form; hide extra buttons */
		this.replaceState(
			{
				FormName: '',
				CurrentForms: this.state.CurrentForms,
				TheForm: [],
				PulledForm: '',
				EditableForm: [],
				Employee: '',
				formFieldType: this.state.formFieldType,
				currentOptions: this.state.currentOptions,
				currentOptions2: this.state.currentOptions2,
				AllFields: this.state.AllFields,
			}
		);
		/* Make sure only new form elements are available */
		$(".hideForm").fadeIn("slow");
		$(".hideIt").fadeOut("slow");
		$(".addToEditForm").fadeOut("slow");
		$(".employeePull").fadeOut("slow");
		this.setState({FormName: formname});
		this.setState({showResults: true});
		React.findDOMNode(this.refs.formName).value = '';
	},

	/* Determines if the label can be split; if so concat and use as id */
	canSplit: function(str, token) {
		return (str || '').split(token).length > 1;
	},


    displayWarning: function() {
    	$(".FormDeleteBtn").fadeIn("slow");
    },

    /* Grabs current user created forms */
    displayCurrentForms: function() {
    	var forms = this.state.CurrentForms.map(function(f) {
    		return (
    			<div>
	    			<div className="col-xs-12">
	    				<div className="btn-group btn-group-justified" role="group" aria-label="...">
	    					<div className="btn-group" role="group">
		    					<button className="btn btn-default btn-xs" onClick={this.getForm.bind(this, f.FormName)}><b>{f.FormName}</b></button>
		    				</div>
		    				<div className="btn-group" role="group">
		    					<button className="btn btn-default btn-xs" onClick={this.editForm.bind(this, f.FormName)}><i className="glyphicon glyphicon-pencil fa-fw fa-form-edit"></i></button>
		    				</div>
		    				<div className="btn-group" role="group">
		    					<button className="btn btn-default btn-xs" onClick={this.displayWarning}><i className="glyphicon glyphicon-trash fa-form-delete"></i></button>
		    				</div>
		    			</div>
		    			<div className="FormDeleteBtn">
		    				<h5 className="help-block has-error">Please note: By clicking Delete, you will be deleting <b><i>all</i></b> employee
		    				information generated from the form, along with the form itself.</h5>
		    				<div className="btn-group btn-group-justified" role="group" aria-label="...">
		    					<div className="btn-group" role="group">
		    						<button className="btn btn-danger btn-xs" onClick={this.deleteForm.bind(this, f.FormName)}>Delete</button>
		    					</div>
		    					<div className="btn-group" role="group">
		    						<button className="btn btn-default btn-xs" onClick={this.clear}>Ignore</button>
		    					</div>
		    				</div>
		    			</div>
	    			</div>
	    		</div>	
    		)
    	}.bind(this))
    	return (
    		<div id="__CURRENT_FORMS_" ref="__CURRENT_FORMS_" className="row">
    			{forms}

    		</div>
    	)
    },

    /* Basic text input */
	renderTextInput: function(id, label, type, click, change) {
		return (
			this.renderField(id, label,
				<input type={type} className="form-control input-sm" id={id} ref={id} onClick={click} onChange={change} />
			)
		);
    },

    renderSelect: function(id, label, values, option, change, title) {
		var options = values.map(function(value) {
			return <option key={value} value={value}>{value}</option>
		});
		return (
			this.renderField(id, label,
				<select className="form-control input-sm" id={id} ref={id} onChange={change} data-toggle="tooltip" data-placement="bottom" title={title}>
				<option value="">{option}</option>
				{options}
				</select>
			)
		)
	},

	renderField: function(id, label, field) {
		return(
			<div className="form-group">
				<label className="control-label">{label}</label>	
				{field}
			</div>	
		);
	},
	/* Clears everything but the current forms */
	clear: function() {
		/* hide submit button until a form appears */
		$(".hideIt").css("display","none");
		$(".hideForm").fadeOut("slow");
		$(".addToEditForm").fadeOut("slow");
		$(".employeePull").fadeOut("slow");
		$(".FormDeleteBtn").fadeOut("slow");
		$(".fieldOptions").fadeOut("slow");
		$(".fieldOptions2").fadeOut("slow");
		$(".selectDept").removeClass('has-error');
		$(".addEmployeeErrorHelpBlock").fadeOut("slow");
		$(".addDepartmentErrorHelpBlock").fadeOut("slow");
		$(".addEmployeeError").removeClass('has-error');
		React.findDOMNode(this.refs.inputTypes).value = '';
		this.replaceState(
			{
				FormName: '',
				CurrentForms: this.state.CurrentForms,
				TheForm: [],
				PulledForm: '',
				EditableForm: [],
				Employee: '',
				AllFields: [],
				currentOptions: [],
				currentOptions2: [],
				formFieldType: '',
			}
		);
	},

	render: function() {
		return (
			<div>
				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-6">
							<div className="selectDept">
								{this.renderSelect("department","Department", OPTIONS.DEPARTMENT, "Select Department")}
							</div>
							<p className="help-block addDepartmentErrorHelpBlock"></p>
							<label className="control-label">Form Name</label>
							<div className="input-group">
							    <input type="text" id="formName" ref="formName" className="form-control input-sm" placeholder="Enter Form Name..." />
							    <span className="input-group-btn">
							    	<button className="btn btn-default btn-sm" type="button" onClick={this.initForm}>Initialize Form</button>
							    </span>
						    </div><br />
						    
						    {this.renderTextInput("fieldLabel","Enter Field Name","text")}
						    <div className="row">
							    <div className="col-sm-6">
							    	{this.renderSelect("inputTypes","Field Type", OPTIONS.TYPES, "Select Field Type",this.setFieldType)}
							    </div>
							    <div className="col-sm-6">
							    	{this.renderSelect("formPermissions","Field Access", OPTIONS.PERMISSIONS, "Select Permission","",
							    		"1: Administrator\n2: Manager\n3: HR\n4: Regular")}
							    </div>	
						    </div>

						    <div className="fieldOptions"> 
							    <div className="input-group">
								    <input type="text" id="addOptions" ref="addOptions" className="form-control input-sm" placeholder="Enter options..." />
								    <span className="input-group-btn">
								    	<button className="btn btn-default btn-sm" type="button" onClick={this.addOption}>Add option</button>
								    </span>
							    </div>
							    <div id="fieldDisplayOptions" ref="fieldDisplayOptions" className="thumbnail">{this.displayOptionFields(this.state.currentOptions, this.state.formFieldType)}</div>
						    </div>
						    <div className="btn-group">
								<button type="submit" className="btn btn-primary btn-sm" onClick={this.addField}>Add Field</button>					
								<button type="submit" className="btn btn-primary btn-sm" onClick={this.saveForm}>Save Form</button>					
								<button type="submit" className="btn btn-default btn-sm" onClick={this.clear}>Clear</button>
							</div>
						</div>
						<div className="col-sm-6">
							<div id="currentForms" ref="currentForms" className="thumbnail">
								<h5>User Created Forms</h5><hr />
								{this.displayCurrentForms()}
							</div>
						</div>
					</div>
					<div className="row">
						<div id="formSubmitError" ref="formSubmitError"></div>
						<div className="col-xs-12">
							<hr />
							<center><div className="well well-sm hideForm"><h4>Form Name: <b>{this.state.FormName}</b></h4></div></center>
						</div>	
					</div>
					{this.displayCurrentFields()}
					{this.displayForm()}
					{this.displayEditForm()}
				</div>
			</div>	
		)
	}
});

function contains(a, obj) {
	/* Checks whether a value exists in an array */
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}