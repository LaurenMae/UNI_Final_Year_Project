/*
	Draws grouped bar chart using D3 library - http://d3js.org/
	
	data: data returned by database query
*/
function drawGroupedBarChart(data){  
	/*
		Graph scales setup
	*/
	var margin = {top: 20, right: 80, bottom: 30, left: 40},
		width = ((window.innerWidth/100)*52),
		height = 500 - margin.top - margin.bottom;

	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#6abc9f", "#CFCECA", "#305749", "#8CF5D0"]);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	/*
		Create div element to hold show/hide link
	*/
	var div = d3.select("#text").append('div');

	div.append('a')
		.on('click', function(){
			if(this.innerHTML.indexOf('Hide') != -1){
				this.parentNode.childNodes[1].style.display = 'none'; 
				this.innerHTML = "Show Graph";
			}
			else{
				this.parentNode.childNodes[1].style.display = 'table'; 
				this.innerHTML = "Hide Graph";
			}
		})
		.html('Hide Graph');
		
	/*
		Create SVG container for graph
	*/
	var svg = div.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	/*
		Add key value pair to each group data item
	*/
	var groupNames = d3.keys(data[0]).filter(function(key) { return key !== "Day"; });

	data.forEach(function(d) {
		d.groups = groupNames.map(function(name) { return {name: name, value: +d[name]}; });
	});

	/*
		Set graph x and y axis ranges
	*/
	x0.domain(data.map(function(d) { return d.Day; }));
	x1.domain(groupNames).rangeRoundBands([0, x0.rangeBand()]);
	y.domain([d3.min(data, function(d) { return d3.min(d.groups, function(d) { return d.value; }); })-2, d3.max(data, function(d) { return d3.max(d.groups, function(d) { return d.value; }); })+2]);

	/*
		Create graph elements and append to SVG
		
		xAxis: the x-axis
		yAxis: the y-axis
	*/
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	  .append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Total Shifts");

	/*
		Generates bars for each group
	*/
	var bars = svg.selectAll(".rect")
		.data(data)
	  .enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) { return "translate(" + x0(d.Day) + ",0)"; });

	bars.selectAll("rect")
		.data(function(d) { return d.groups; })
	  .enter().append("rect")
		.attr("width", x1.rangeBand())
		.attr("x", function(d) { return x1(d.name); })
		.attr("y", function(d) { return y(d.value); })
		.attr("height", function(d) { return height - y(d.value); })
		.style("fill", function(d) { return color(d.name); });

	/*
		Creates graph key
	*/
	var legend = svg.selectAll(".legend")
		.data(groupNames.slice())
	  .enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - (margin.right/2) + margin.left)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", width - (margin.right/2) + margin.left + 80)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
}