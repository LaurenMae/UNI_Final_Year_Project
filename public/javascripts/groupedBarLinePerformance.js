/*
	Draws grouped bar and line chart using D3 library - http://d3js.org/
	
	data: data returned by database query
	callback: the javascript function to call after function completes
*/
function drawGroupedBarLineChartPerf(data, callback){ 
	/*
		Graph scales setup
	*/
	var margin = {top: 20, right: 150, bottom: 30, left: 50},
		width = ((window.innerWidth/100)*52),
		height = 500 - margin.top - margin.bottom;

	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
		.range([height, 0]);

	var y2 = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#6abc9f", "#CFCECA", "#305749", "#8CF5D0"]);

	var xAxis = d3.svg.axis()
		.scale(x0)
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

	var showHide = div.append('a')
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
		Splits data by shift pattern and sums downtime
		creates new key value pair in data objects using downtime sum
	*/
	var newData = [];
	var performance = [];

	var keys = Object.keys(data[0]);

	for(var item in data){
		for(var key in keys){
			if(keys[key] == "Performance %"){
				performance.push(data[item][keys[key]]);
			}
		}
	}
	
	var currentSVGs = document.getElementsByTagName('svg');
	var chartType = "Day"; //Total Average Downtime (Hours)";

	for(var svg=0; svg<currentSVGs.length; svg++){
		if(currentSVGs != null){
			if(currentSVGs[svg].id.indexOf('Month') != -1){
				chartType = "Day";
			}
			else if(currentSVGs[svg].id.indexOf('Day') != -1){
				chartType = "Month";
			}
		}
	}
	
	for(var item in data){
		var total = 0;
		if(newData.length == 0){
			var obj = {};
			obj[chartType] = data[item][chartType];
			obj['Reject'] = data[item]['Average Reject Produced (Kg)'];
			obj['Product'] = data[item]['Average Produced (Kg)'];
			newData.push(obj);
		}
		else{
			var duplicate = false;

			for(var day in newData){
				if(newData[day][chartType] == data[item][chartType]){
					duplicate = true;
					newData[day]['Reject'] = data[day]['Average Reject Produced (Kg)'];
					newData[day]['Product'] = data[day]['Average Produced (Kg)'];
				}			
			}

			if(!duplicate){
				var obj = {};
				obj[chartType] = data[item][chartType];
				obj['Reject'] = data[item]['Average Reject Produced (Kg)'];
				obj['Product'] = data[item]['Average Produced (Kg)'];
				newData.push(obj);
			}
		}
	}

	/*
		Create SVG container for graph
	*/
	var svg = div.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("id", chartType)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	/*
		Add key value pair to each group data item
	*/
	var groupNames = d3.keys(newData[0]).filter(function(key) { return key !== chartType && key != "Performance %"; });

	newData.forEach(function(d) {
		d.groups = groupNames.map(function(name) {return { name: name, value: +d[name] };});
	});

	/*
		Set graph x and y axis ranges
	*/
	x0.domain(data.map(function(d) { return d[chartType]; }));
	x1.domain(groupNames).rangeRoundBands([0, x0.rangeBand()]);
	y.domain([0, d3.max(newData, function(d) { return d3.max(d.groups, function(d) { return d.value; }); })+1000]);
	y2.domain([d3.min(data, function(d) { return d['Performance %']; }) - 2, d3.max(data, function(d) { return d['Performance %']; }) + 2]);

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
		Generates bars for each group
	*/
	var bars = svg.selectAll(".rect")
		.data(newData)
	  .enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) { return "translate(" + x0(d[chartType]) + ",0)"; });

	bars.selectAll("rect")
		.data(function(d) { return d.groups; })
	.enter().append("rect")
		.attr("width", x1.rangeBand())
		.attr("x", function(d) { return x1(d.name); })
		.attr("y", function(d) { return y(d.value); })
		.attr("height", function(d) { return height - y(d.value); })
		.style("fill", function(d) { return color(d.name); });
	
	var textAmount = svg.selectAll("text.bar")
			.data(newData)
		.enter().append("g")
			.attr("class", "g")
			.attr("transform", function(d) { return "translate(" + x0(d[chartType]) + ",0)"; });
	
	textAmount.selectAll("text.bar")
		.data(function(d) { return d.groups; })
	.enter().append("text")
		.attr("x", function(d) { return x1(d.name); })
		.attr("y", function(d) { return y(d.value); })
		.style("font-size", "10px")
		.text(function(d) { return d.value; });

	svg.append("g")
		.attr("class", "y axis")
		.attr('transform', 'translate('+width+', 0)')
		.call(yAxis2)
	  .append("text")
		.attr("transform", "rotate(-90), translate(0, 20)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Performance %");

	/*
		Generates line element for data element chartType
	*/
	var line = d3.svg.line()
		.x(function(d) { return x0(d[chartType]) + x1.rangeBand(); })
		.y(function(d) { return y2(d['Performance %']); }); 

	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr('fill', 'none')
		.style('stroke', 'red')
		.style('stroke-width', '1.5px')
		.attr("d", line);


	svg.append("text")
		.datum(data[data.length-1])
		.attr("transform", function(d) { return "translate(" + (x0(d[chartType])) + "," + (y2(d['Performance %']) + 1) + ")"; })
		.attr("dy", ".71em")
		.style('font', '10px sans-serif')
		.text('Performance %');

	/*
		Creates graph key
	*/
	var legend = svg.selectAll(".legend")
		.data(groupNames.slice())
	  .enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate("+ i * 70 + ",0)"; });

	legend.append("text")
		.attr("x", (width/2))
		.attr("y", 2)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.style('fill', color)
		.html(function(d) { return d; });

	/*
		Calls javascript function if callback function is not null
	*/
	if(callback != null){
		callback(data);
	}
}