var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			header: '',
			top: '',
			where: '',
			nav: ''
		}
	},
	render: function() {
		return(
			<div className="col-xs-12">
				<div className="page-header" id={this.props.nav}>
					<b>{this.props.header}</b>{"\u00a0"}{"\u00a0"}{"\u00a0"} {this.props.date.toString()} 
					<span className="right"><a className="backToTop" href={this.props.where}>{this.props.top}</a></span>
				</div>
			</div>	
		);
	}
});