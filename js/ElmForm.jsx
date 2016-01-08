var React = require('react');
var FormHeader = require('./FormHeader');
var OPTIONS = require('./options');


module.exports = React.createClass({
  	getDefaultProps: function() {
	    return {
	      email: false,
	      question: false
	    }
  	},
 
 	getInitialState: function() {
    	return {
    		errors: {},
    		data: this.props.data,
    		date: new Date(),
    		top: ''
    	}
  	},
 
 	isValid: function() {
 		/* Error Fields */
	    
	    var fields = ['firstName', 'lastName','posTitle','accountName','displayName',
	    	'email','country','hireLoc','state','company','address','department','manager',
	    	'hireDate','startDate']; 
	    if (this.props.email) {fields.push('email');}
	    if (this.props.question) {fields.push('question');}
	 
	    var errors = {};
	    fields.forEach(function(field) {
	      var value = trim(this.refs[field].getDOMNode().value)
	      if (!value || value === "") {
	        errors[field] = 'This field is required';
	      }
	    }.bind(this));
	    this.setState({errors: errors});
	 
	    var isValid = true
	    for (var error in errors) {
	      isValid = false;
	      break;
	    }
	    return isValid;
  	},
 	
 	/* Clear form data after submit */
 	clearData: function() {
 		for(var ref in this.refs) {
 			this.refs[ref].getDOMNode().value = '';
 		}
 	},

 	getFormData: function() {
	    var data = {
			/* General */
			firstName: this.refs.firstName.getDOMNode().value,
			lastName: this.refs.lastName.getDOMNode().value,
			posTitle: this.refs.posTitle.getDOMNode().value,
			accountName: this.refs.accountName.getDOMNode().value,
			displayName: this.refs.displayName.getDOMNode().value,
			email: this.refs.email.getDOMNode().value,
			country: this.refs.country.getDOMNode().value,
			hireLoc: this.refs.hireLoc.getDOMNode().value,
			state: this.refs.state.getDOMNode().value,
			company: this.refs.company.getDOMNode().value,
			address: this.refs.address.getDOMNode().value,
			department: this.refs.department.getDOMNode().value,
			manager: this.refs.manager.getDOMNode().value,
		      	hireDate: this.refs.hireDate.getDOMNode().value,
		      	startDate: this.refs.startDate.getDOMNode().value,
		      	endDate: this.refs.endDate.getDOMNode().value,
		      	permissions: this.refs.permissions.getDOMNode().value
	    }
	    if (this.props.question) data.question = this.refs.question.getDOMNode().value
	    return data
  	},

 	appendLastName: function(f) {
    	var accountname = this.refs.accountName.getDOMNode();
    	var displayname = this.refs.displayName.getDOMNode();
 		var email = this.refs.email.getDOMNode();
 		var firstname = this.refs.firstName.getDOMNode().value;
 		var val = f.target.value;

 		accountname.value = accountname.value[0] + val.toLowerCase();
 		email.value = email.value[0] + val.toLowerCase() + "@no_reply.com";
 		/* Wierd behavior if you just concat displayname with the value being typed. */
 		displayname.value = firstname + "_" + val;
    },

 	appendFirstName: function(e) {
 		var accountname = this.refs.accountName.getDOMNode();
 		var displayname = this.refs.displayName.getDOMNode();
 		var email = this.refs.email.getDOMNode();
 		var unixhomedir = this.refs.unixHomeDir.getDOMNode(); 
 		accountname.value = e.target.value[0];
 		displayname.value = e.target.value;
 		email.value = e.target.value[0];
 	},

 	setInfo: function(e) {
 		/* On country select: Location, state, company, street addr */
 		var country = this.refs.country.getDOMNode();
 		var location = this.refs.hireLoc.getDOMNode();
 		var state = this.refs.state.getDOMNode();
 		var company = this.refs.company.getDOMNode();
 		var address = this.refs.address.getDOMNode();
 		switch (e.target.value) {
 			case "One":
 				location.value = "Location 1";
 				state.value = "State 1";
 				company.value = "Company 1";
 				address.value = "Company Address 1";
 				//console.log("The value is: " + e.target.value);
 				break;
 			case "Two":
 				location.value = "Location 2";
 				state.value = "State 2";
 				company.value = "Company 2";
 				address.value = "Company Address 2";
 				//console.log("The value is: " + e.target.value);
 				break;
 			default:
 				location.value = "";
 				state.value = "";
 				company.value = "";
 				address.value = "";
 				//console.log("Nothing selected");
 				break; 		 
 		}
 	},
 	// Activate jquery-ui datepicker if the component loads correctly
 	componentDidMount: function() {
 		var hireDate = this.refs.hireDate.getDOMNode();
 		var startDate = this.refs.startDate.getDOMNode();
 		var endDate = this.refs.endDate.getDOMNode();
 		$(hireDate).datepicker();
 		$(startDate).datepicker();
 		$(endDate).datepicker();
 	},

 	setOfficeNum: function(e) {
 		var physicaldelivery = this.refs.physDeliveryOffice.getDOMNode();
 		physicaldelivery.value = e.target.value;
 	},

    renderTextInput: function(id, label, click, change) {
		return (
			this.renderField(id, label,
				<input type="text" className="form-control input-sm" id={id} ref={id} onClick={click} onChange={change} />
			)
		);
    },
 	
 	renderDateInput: function(id, label, click, change) {
		return (
			this.renderField(id, label,
				<input type="text" className="form-control input-sm" id={id} ref={id} onClick={click} onChange={change} />
			)
		);
	},

	renderTextArea: function(id, label, rows) {
		return (
			this.renderField(id, label, 
				<textarea type="text" className="form-control" id={id} ref={id} rows={rows} />
			)
		);		
	},
 
    renderSelect: function(id, label, values, option, click, change, title) {
		var options = values.map(function(value) {
			return <option key={value} value={value}>{value}</option>
		});
		return (
			this.renderField(id, label,
				<select className="form-control input-sm" id={id} ref={id} onClick={click} onChange={change} data-toggle="tooltip" data-placement="bottom" title={title}>
				<option value="">{option}</option>
				{options}
				</select>
			)
		)
	},
 
    renderRadioInlines: function(id, label, kwargs) {
	    var radios = kwargs.values.map(function(value) {
	      var defaultChecked = (value == kwargs.defaultCheckedValue)
	      return <label className="radio-inline">{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}{"\u00a0"}
	        <input type="radio" ref={id} name={id} value={value} defaultChecked={defaultChecked}/>
	        {"\u00a0"}{"\u00a0"}{"\u00a0"}{value}
	      </label>
	    })
	    return this.renderField(id, label, radios)
  	},
 
    renderField: function(id, label, field) {
		return(
			<div className="col-xs-6">	
				<div className={$c('form-group', {'has-error': id in this.state.errors})}>
					<label htmlFor={id} className="control-label"><b>{label}</b></label>
					{field}
				</div>	
			</div>	
		);
	},

    render: function() {
	    return ( 
		    <form> 		
				<FormHeader header="General" date={this.state.date} />
		        {this.renderTextInput("firstName", "First Name", "", this.appendFirstName)}
		        {this.renderTextInput('lastName', 'Last Name',"",this.appendLastName)}
		        {this.renderTextInput("posTitle", "Position Title")}
		        {this.renderDateInput("hireDate", "Hire Date")}
				{this.renderDateInput("startDate", "Start Date")}
				{this.renderDateInput("endDate", "End Date")}
		        <FormHeader header="Account" nav="Account" date=""/>
				{this.renderTextInput("accountName", "Account Name")}
				{this.renderTextInput("displayName", "Display Name")}
				{this.renderTextInput("email", "Email")}
				<FormHeader header="Header 1" nav="Header1" date=""/>
				{this.renderSelect("country", "Country", OPTIONS.COUNTRIES, "Select Country", "", this.setInfo)}
				{this.renderSelect("hireLoc", "Hire Location", OPTIONS.HIRELOCATION, "Select Location")}
				{this.renderSelect("state", "State", OPTIONS.STATES, "Select State")}
				{this.renderSelect("company", "Company", OPTIONS.COMPANIES, "Select Company")}	
				{this.renderTextInput("address", "Street Address")}
				{this.renderSelect("department","Department", OPTIONS.DEPARTMENT, "Select Department")}
				{this.renderSelect("manager", "Manager", OPTIONS.MANAGERS, "Select Manager")}
				{this.renderSelect("permissions", "ELM Permissions", OPTIONS.PERMISSIONS, "Select Employee Permission","","",
					"1: Administrator\n2: Manager\n3: HR\n4: Regular")}
				
				<div className="row"></div>
			
		        {this.props.question && this.renderTextArea('question', 'Question')}
		        

		    </form>
		);
    },
});

 
var trim = function() {
  var TRIM_RE = /^\s+|\s+$/g;
  return function trim(string) {
    return string.replace(TRIM_RE, '');
  }
}();


function $c(staticClassName, conditionalClassNames) {
	var classNames = [];
	if(typeof conditionalClassNames == 'undefined') {
		conditionalClassNames = staticClassName;
	}
	else {
		classNames.push(staticClassName);
	}
	for(var className in conditionalClassNames) {
		if(!!conditionalClassNames[className]) {
			classNames.push(className);
		}
	}
	return classNames.join(' ');
}
