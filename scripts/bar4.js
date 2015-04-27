// Global variables and objects
var c1;
var svg1;
var xScale;
var yScale;
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

// Attach the functions to the buttons
d3.select("#b1").on("click", updateBars);
d3.select("#b2").on("click", randomBars);
d3.select("#b3").on("click", deleteBar);
d3.select("#b4").on("click", addBar);

// Change the labels on the buttons
document.getElementById("b1").innerHTML="Update";
document.getElementById("b2").innerHTML="Random";
document.getElementById("b3").innerHTML="Delete";
document.getElementById("b4").innerHTML="Insert";

// Selection of the div into which we will insert the chart 
c1 = d3.select("#chart1");

// Append an SVG to the div with an offset from the upper left corner
svg1 = c1.append("svg")
	.attr("width", barConfig.width)
	.attr("height", barConfig.height)
	.append("g")
	.attr("transform", "translate(" + barConfig.leftMargin + "," + barConfig.topMargin + ")")
	;

// Compute the scales
adjustScales();

// Creation of DOM elements from initial data
svg1.selectAll("rect")
	.data(dataset,function(d){return d.key;})
	.enter().append("rect")
	.attr("x", function(d,i){return xScale(i);})
	.attr("y", function(d,i){return yScale(d.v);})
	.attr("width", function(d,i){return barConfig.chartWidth/dataset.length-4;})
	.attr("height", function(d,i) {return barConfig.chartHeight-yScale(d.v);})
	;
	
	dumpDataset();

//read airport.csv

var numset=[] ;
var nameset=[];
d3.csv("airports/airports.csv"),function(error,data){
	if(error){  
    console.log(error);  
   }else{<span style="font-family: Arial, Helvetica, sans-serif; background-color: rgb(255, 255, 255);">  </span>  

}
for(var i=0;i<data.length;i++){  
 numset.push(parseFloat(data[i].Delicious));  
 nameset.push(data[i].Food);  
}}

console.log(data)





// ----- Functions -----
// Populate the data array with random values  from 5 to 30
function randomBars() {
	var k;
	for (k=0; k<20; k++) {
		dataset[k].v = ;
	}
	dumpDataset();
}

// Update the DOM elements to reflect changes in the data array
function updateBars() {
	// Re-compute the scales
	adjustScales();
	// Bind the new dataset
	var dataJoin = svg1.selectAll("rect")
		.data(dataset,function(d){return d.key;});
		
	// The "enter" set consists of new data in the data array
	// The bar is initially set with zero height so it can transition later
	dataJoin.enter().append("rect")
		.attr("x", function(d,i){return xScale(i);})
		.attr("y", function(d,i){return barConfig.chartHeight;})
		.attr("width", function(d,i){return barConfig.chartWidth/dataset.length-4;})
		.attr("height", function(d,i) {return 0;})
		;
	// The "update" set now includes the "enter" set
	// A transition is applied to smootly change the data
	dataJoin.transition().duration(500)
		.attr("x", function(d,i){return xScale(i);})
		.attr("y", function(d,i){return yScale(d.v);})
		.attr("width", function(d,i){return barConfig.chartWidth/dataset.length-4;})
		.attr("height", function(d,i) {return barConfig.chartHeight-yScale(d.v);})
		;
	// The "exit" set is transitioned to zero height and removed
	dataJoin.exit().transition().duration(500)
		.attr("y", function(d,i){return barConfig.chartHeight;})
		.attr("height", function(d,i) {return 0;})
		.remove()
		;
}

// Delete one data array element at the second position
function deleteBar() {
	dataset.splice(1,1);
	dumpDataset();
}

// Add one random value data element at the 3rd position of the data array
var newIdCtr = 10;
function addBar() {
	var dat ={};
	dat.key = "b" + String(newIdCtr++);
	dat.v = Math.random()*25.0 + 5.0;
	dataset.splice(2,0, dat);
	dumpDataset();
}

// Adjust the X and Y scales
function adjustScales() {
	yScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function(d){return d.v;})])
		.range([barConfig.chartHeight, 0])
		;
	xScale = d3.scale.linear()
		.domain([0, dataset.length])
		.range([0, barConfig.chartWidth])
		;
}

// Display dataset on 2nd chart
function dumpDataset()
{
	var e = document.getElementById("chart1");
	e.style.fontFamily='Courier';
	e.style.fontSize='12px';
	e.innerHTML = '';
	for (var i=0; i<dataset.length; i++) {
		var s = JSON.stringify(dataset[i]);
		e.innerHTML += s+'<br/>'
	}
}

