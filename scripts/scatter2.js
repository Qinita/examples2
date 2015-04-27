// Global variables and objects
var c1;
var svg1;
var gSelect;
var xScale;
var yScale;
var xAxis;
var yAxis;
var dataset = [];
var chartConfig = {
	width : 640,
	height : 480,
	leftMargin : 150,
	topMargin : 50,
	yScale : 6.0,
	xScale : 35.0,
	chartWidth: 250,
	chartHeight : 250
}
// Color function
var colorfun = d3.scale.category10();

// Attach the functions to the buttons
d3.select("#b1").on("click", updateChart);
d3.select("#b2").on("click", randomChart);
d3.select("#b3").on("click", deleteDatum);
d3.select("#b4").on("click", addDatum);

// Change the labels on the buttons
document.getElementById("b1").innerHTML="Update";
document.getElementById("b2").innerHTML="Random";
document.getElementById("b3").innerHTML="Delete";
document.getElementById("b4").innerHTML="Insert";

// read in the JSON file
d3.json("sdata.json", gotTheData);

function gotTheData(err, dat) {
	if (err) return console.warn(err);
	dataset = dat;
	// Selection of the div into which we will insert the chart 
	c1 = d3.select("#chart1");

	// Append an SVG to the div with an offset from the upper left corner
	svg1 = c1.append("svg")
		.attr("width", chartConfig.width)
		.attr("height", chartConfig.height)
		.append("g")
		.attr("transform", "translate(" + chartConfig.leftMargin + "," + chartConfig.topMargin + ")")
		;

	// Compute the scales
	adjustScales();

	// Create axes and append to SVG
	xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	yAxis = d3.svg.axis().scale(yScale).orient("left");
	svg1.append("g").attr("class", "xaxis axis")
		.attr("transform", "translate(0," + chartConfig.chartHeight + ")")
		.call(xAxis)
		;
	svg1.append("g").attr("class", "yaxis axis").call(yAxis);

	// Creation of DOM elements from initial data
	gSelect = svg1.selectAll("g.node")
		.data(dataset,function(d){return d.key;})
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d,i) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"})
		;
	gSelect.append("circle")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("fill", function(d,i) {return colorfun(Math.round(d.dia));})
		.attr("r", function(d,i){return d.dia/2;});
	gSelect.append("text")
		.attr("x", function(d,i){return d.dia/2+3;})
		.attr("y", 0)
		.attr("class", "ctext")
		.text(function(d,i){return Math.round(d.dia);})
		;

	dumpDataset();
}
	
// ----- Functions -----

// Populate the data array with random values  from 5 to 30
function randomChart() {
	var k;
	for (k=0; k<dataset.length; k++) {
		dataset[k].dia = Math.random()*25.0 + 5.0;
		dataset[k].x = Math.random()*30.0;
		dataset[k].y = Math.random()*30.0;
	}
	dumpDataset();
}

// Update the DOM elements to reflect changes in the data array
function updateChart() {
	// Re-compute the scales
	adjustScales();
	// adjust the axes
	xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	yAxis = d3.svg.axis().scale(yScale).orient("left");
	svg1.selectAll("g.xaxis.axis").transition().duration(500).call(xAxis);
	svg1.selectAll("g.yaxis.axis").transition().duration(500).call(yAxis);
	// Bind the new dataset
	var dataJoin = svg1.selectAll("g.node")
		.data(dataset,function(d){return d.key;});
		
	// The "enter" set consists of new data in the data array
	// The bar is initially set with zero height so it can transition later
	gSelect = dataJoin.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d,i) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"})
		;
	gSelect.append("circle")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("fill", function(d,i) {return colorfun(Math.round(d.dia));})
		.attr("r", function(d,i){return 1;});
	gSelect.append("text")
		.attr("x", function(d,i){return d.dia/2+3;})
		.attr("y", 0)
		.attr("class", "ctext")
		.text(function(d,i){return Math.round(d.dia);})
		;

	// The "update" set now includes the "enter" set
	// A transition is applied to smootly change the data
	dataJoin.transition().duration(500)
		.attr("class", "node")
		.attr("transform", function(d,i) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"})
		;
	dataJoin.selectAll("circle").transition().duration(500)
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("fill", function(d,i) {return colorfun(Math.round(d.dia));})
		.attr("r", function(d,i){return d.dia/2;});
	dataJoin.selectAll("text.ctext")
		.attr("x", function(d,i){return d.dia/2+3;})
		.attr("y", 0)
		.attr("class", "ctext")
		.text(function(d,i){return Math.round(d.dia);})
		;

	// The "exit" set is transitioned to zero diameter and removed
	dataJoin.exit().selectAll("circle").transition().duration(500)
		.attr("r", function(d,i){return 0;});
	dataJoin.exit().transition().duration(500)
		.remove()
		;
}

// Delete one data array element at the second position
function deleteDatum() {
	dataset.splice(1,1);
	dumpDataset();
}

// Add one random value data element at the 3rd position of the data array
var newIdCtr = 10;
function addDatum() {
	var dat ={};
	dat.key = "b" + String(newIdCtr++);
	dat.dia = Math.random()*25.0 + 5.0;
	dat.x = Math.random()*30.0;
	dat.y = Math.random()*30.0;
	dataset.splice(2,0, dat);
	dumpDataset();
}

// Adjust the X and Y scales
function adjustScales() {
	yScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d){return d.y;})])
		.range([chartConfig.chartHeight, 0])
		;
	xScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d){return d.x;})])
		.range([0, chartConfig.chartWidth])
		;
}

// Display dataset on 2nd chart
function dumpDataset()
{
	var e = document.getElementById("chart2");
	e.style.fontFamily='Courier';
	e.style.fontSize='12px';
	e.innerHTML = '';
	for (var i=0; i<dataset.length; i++) {
		var s = JSON.stringify(dataset[i]);
		e.innerHTML += s+'<br/>'
	}
}

