/*
	Draws grouped bar and line chart using D3 library - http://d3js.org/
	
	data: data returned by database query
	callback: the javascript function to call after function completes
*/
function drawBarLineChart(data, callback){
	/*
		Graph scales setup
	*/
	var margin = {top: 20, right: 40, bottom: 30, left: 45},
		width = ((window.innerWidth/100)*52),
		height = 500 - margin.top - margin.bottom;

	var formatPercent = d3.format(".0%");

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
		.range([height, 0]);

	var y2 = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom"); 

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var yAxis2 = d3.svg.axis()
		.scale(y2)
		.orient("right");

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
		Switches data values used to draw line chart
	*/
	var chartType = "Total Average Downtime (Hours)";
	var currentSVGs = document.getElementsByTagName('svg');

	for(var svg=0; svg<currentSVGs.length; svg++){
		if(currentSVGs != null){
			if(currentSVGs[svg].id.indexOf('Runtime') != -1){
				chartType = "Total Average Downtime (Hours)";
			}
			else if(currentSVGs[svg].id.indexOf('Downtime') != -1){
				chartType = "Average Runtime (Hours)";
			}
		}
	}

	/*
		Create SVG container for graph
	*/
	var svg = div.append("svg")
		.attr("width", '100%')
		.attr("height", height + margin.top + margin.bottom)
		.attr("id", chartType)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

	/*
		Sums downtime, creates new key value pair in data objects
	*/
	var keys = Object.keys(data[0]);

	for(var item in data){
		var total = 0;
		for(var key in keys){
			if(keys[key].indexOf('Day') != -1 || keys[key].indexOf('Group') != -1 
				|| keys[key].indexOf('Month') != -1){
					data[item]['xValue'] = data[item][keys[key]];
			}
			if(keys[key].indexOf('(Hours)') != -1 && keys[key].indexOf('Runtime') == -1){
				total += parseFloat(data[item][keys[key]]);
			}
		}
		data[item]['Total Average Downtime (Hours)'] = total;
	}	

	/*
		Set graph x and y axis ranges
	*/
	x.domain(data.map(function(d) { return d.xValue; }));
	y.domain([d3.min(data, function(d) { return parseFloat(d['Average Produced (Kg)']); }) - 1000, d3.max(data, function(d) { return parseFloat(d['Average Produced (Kg)']); })+1000]);
	y2.domain([d3.min(data, function(d) { return parseFloat(d[chartType]); }) - 2, d3.max(data, function(d) { return parseFloat(d[chartType]); }) + 2]);

	/*
		Create graph elements and append to SVG
		
		xAxis: the x-axis
		yAxis: the y-axis for the bar chart
		yAxis2: the y-axis for the line chart
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
		.text("Average Produced (Kg)");

	/*
		Generates bars
	*/
	svg.selectAll(".bar")
		.data(data)
	  .enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.xValue); })
		.attr("width", x.rangeBand())
		.attr("y", function(d) { return y(parseFloat(d['Average Produced (Kg)'])); })
		.attr("height", function(d) { return height - y(parseFloat(d['Average Produced (Kg)'])); });


	svg.append("g")
		.attr("class", "y axis")
		.attr('transform', 'translate('+ width +', 0)')
		.call(yAxis2)
	  .append("text")
		.attr("transform", "rotate(-90), translate(0, -20)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(chartType);

	/*
		Generates line element for data element chartType
	*/
	var line = d3.svg.line()
		.x(function(d) { return x(d.xValue) + x.rangeBand()/2; })
		.y(function(d) { return y2(parseFloat(d[chartType])); }); 

	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr('fill', 'none')
		.style('stroke-width', '1.5px')
		.attr("d", line);

	svg.append("text")
		.datum(data[data.length-1])
		.attr("transform", function(d) { return "translate(" + (x(d.xValue)) + "," + (y2(parseFloat(d[chartType])) + 1) + ")"; })
		.attr("dy", ".71em")
		.style('font', '10px sans-serif')
		.text(chartType);
	
	if(callback != null){
		callback(data, showGroupComparison);
	}
	else{
		showGroupComparison();
	}
}