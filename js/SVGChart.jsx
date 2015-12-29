var React = require('react');

var SVGChart = React.createClass({

	showChart: function() {
		var width = this.props.width;
		var height = this.props.height;	
		var data = this.props.data;
		var file = this.props.file;


		var x = d3.scale.linear()
		    .domain([0, d3.max(data)])
		    .range([0, width]);

		var chart = d3.select(".chart")
			.attr("width", width)
			.attr("height", height * data.length);

		var bar = chart.selectAll("g")
				.data(data)
			.enter().append("g")
				.attr("transform", function(d, i) { return "translate(0," + i * height + ")"; });	
		bar.append("rect")
			.attr("width", x)
			.attr("height", height - 1);

		bar.append("text")
			.attr("x", function(d) { return x(d) - 3; })
			.attr("y", height / 2)
			.attr("dy", ".35em")
			.text(function(d) { return d; });	
	},

	handleFile: function() {
		var width = this.props.width;
		var height = this.props.height;	
		var file = this.props.file;

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .1);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var chart = d3.select(".chart")
		    .attr("width", width)
		    .attr("height", height);

		d3.tsv("data.tsv", type, function(error, data) {
		  x.domain(data.map(function(d) { return d.name; }));
		  y.domain([0, d3.max(data, function(d) { return d.value; })]);

		  var bar = chart.selectAll("g")
		      .data(data)
		    .enter().append("g")
		      .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });

		  bar.append("rect")
		      .attr("y", function(d) { return y(d.value); })
		      .attr("height", function(d) { return height - y(d.value); })
		      .attr("width", x.rangeBand());

		  bar.append("text")
		      .attr("x", x.rangeBand() / 2)
		      .attr("y", function(d) { return y(d.value) + 3; })
		      .attr("dy", ".35em")
		      .text(function(d) { return d.value; });
		});


		function type(d) {
		  d.value = +d.value; // coerce to number
		  return d;
		}		
	},

	render: function() {
		return (
			<div>
				<svg className={this.props.chart}></svg>
				{this.showChart()}
				<hr />
			</div>
		)
	}

});


module.exports = SVGChart;