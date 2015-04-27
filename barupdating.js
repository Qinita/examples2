
var outerWidth = 600, outerHeight = 400;
var margin = { top: 20, right: 30, bottom: 30, left: 40 },
    width  = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1)
          .domain(chars);
var y = d3.scale.linear()
          .range([height, 0]);

var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");
var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(10, "%");
var chart = d3.select("#d3newbie-chart")
              .attr("width", outerWidth)
              .attr("height", outerHeight)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// x-axis
chart
    .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")") 
      .call(xAxis);

function type(d) {
    d.value = +d.value;
    return d;
}
function updateDefault() {
    d3.tsv("/downloads/data-chars.tsv", type, update);
}
function updateThisPost() {
    d3.text(".", function(err, data) { update(err, freqs(data)); });
}
function update(err, data) {
    y.domain([0, d3.max(data, function(d) { return d.value; })]);
    // y-axis
    chart.select(".y.axis").remove();
    chart.append("g")
          .attr("class", "y axis")
          .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    var bar = chart.selectAll(".bar")
            .data(data, function(d) { return d.name; });

    // new data:
    bar.enter().append("rect")
       .attr("class", "bar")
       .attr("x", function(d) { return x(d.name); })
       .attr("y", function(d) { return y(d.value); })
       .attr("height", function(d) { return height - y(d.value); })
       .attr("width", x.rangeBand());
    // removed data:
    bar.exit().remove();
    // updated data:
    bar
       .transition()
       .duration(750)
           .attr("y", function(d) { return y(d.value); })
           .attr("height", function(d) { return height - y(d.value); });
};

document.getElementById("defaultInput")
        .onclick = updateDefault;
document.getElementById("thisPostInput")
        .onclick = updateThisPost;
updateDefault();

function freqs(str) {
    var s = str.toUpperCase()
    var n = s.length
    var x = {}
    for (var i = 0; i<chars.length; i++) {
        x[chars[i]] = 0;
    }
    for (var i=0; i<s.length; i++) {
        if (/[A-Z]/.test(s[i])) {
            x[s[i]]++;
        }
    }
    var f = []
    for (var c in x) {
        f.push( { name: c, value: x[c]/=n });
    }
    return f;
}
