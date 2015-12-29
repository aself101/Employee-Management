var React = require('react');

var Chart = React.createClass({

	showChart: function() {
		var x = d3.scale.linear()
		    .domain([0, d3.max(this.props.data)])
		    .range([0, this.props.width]);

		d3.select(".chart")
		  .selectAll("div")
		    .data(this.props.data)
		  .enter().append("div")
		    .style("width", function(d) { return x(d) + "px"; })
		    .text(function(d) { return d; });
	},

	render: function() {
		return (
			<div>
				<div className={this.props.chart}></div>
				{this.showChart()}
			</div>
		)
	}

});

module.exports = Chart;




