// Global variables and objects
var c1;
var svg1;
var dataset = [ {"key":"a","v":5},
	{"key":"b","v":10},
	{"key":"c","v":15},
	{"key":"d","v":20},
	{"key":"e","v":25} ];
var barConfig = {
	width : 640,
	height : 480,
	leftMargin : 150,
	topMargin : 50,
	yScale : 6.0,
	xScale : 35.0,
	barWidth : 30.0,
	chartWidth: 250,
	chartHeight : 250
}

// Selection of the div into which we will insert the chart 
c1 = d3.select("#chart1");

// Append an SVG to the div with an offset from the upper left corner
svg1 = c1.append("svg")
	.attr("width", barConfig.width)
	.attr("height", barConfig.height)
	.append("g")
	.attr("transform", "translate(" + barConfig.leftMargin + "," + barConfig.topMargin + ")")
	;
	
// Creation of DOM elements from initial data
svg1.selectAll("rect")
	.data(dataset,function(d){return d.key;})
	.enter().append("rect")
	.attr("x", function(d,i){return barConfig.xScale * i;})
	.attr("y", function(d,i){return barConfig.chartHeight - barConfig.yScale * d.v;})
	.attr("width", function(d,i){return barConfig.barWidth;})
	.attr("height", function(d,i) {return barConfig.yScale * d.v;})
	;


