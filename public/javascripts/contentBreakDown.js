/*
	Sets: 
		- title
		- data request href
*/
function addDailyTable(product){
	addTitle("Daily Breakdown of Average <br> Production, Downtime and Runtime for Product " + product);
	dataRequest('/dailyBreakDown/' + product, populateTable, createTable());
}

/*
	Sets: 
		- title
		- data request href
*/
function addPatternTable(product){
	addTitle("Breakdown of Average Production, Downtime and Runtime <br> for Product " + product.replace('shift', '') + " by Shift Pattern");
	addTitle("Breakdown of Average Production, Downtime and Runtime <br> for Product " + product.replace('shift', '') + " by Shift Pattern");
	dataRequest('/patternBreakDown/B', populateTable, createTable());
}

/*
	Sets: 
		- title
		- data request href
*/
function addPerformanceTable(product, breakdown){
	addTitle(breakdown + " Performance of Production of Product " + product.replace('shift', '') + "1");
	dataRequest('/' + breakdown.toLowerCase() + 'Performance/' + product, populateTable, createTable());
}

/*
	Displays shift group breakdown for daily analysis pages
*/
function showGroupComparison(){
	if(getActiveTab(false).indexOf('Daily') != -1){
		showTabContent(getActiveTab(false).split('')[0] + 'subs');
	}
}

/*
	Sets: 
		- title
		- data request href
	
	product: current tab ID
	callback: function to call when function completes, can be null
	title: value to set title to, can be null
*/
function addGroupTable(product, callback, title){
	if(title == null){
		addTitle("Breakdown of Average Production, Downtime and Runtime <br> for Product " + product.replace('shift', '') + " by Shift Group");
	}
	else{
		addTitle(title);
	}

	switch (/shift/.test(product)) {
		case true:
			dataRequest('/dailyBreakDown/' + product, populateTable, createTable());
			break;
		case false:
			dataRequest('/groupBreakDown/' + product, populateTable, createTable());
			break;
	}

	if(callback != null){
		callback();
	}
}

/*
	Creates table element and show/hide links
	
	Returns table element
*/
function createTable(){
	var div = d3.select('#text').append('div')
		.attr('class', 'table-responsive');
	
	div.append('a')
		.on('click', function(){
			if(this.innerHTML.indexOf('Hide') != -1){
				this.parentNode.childNodes[this.parentNode.childNodes.length-1].style.display = 'none'; 
				this.innerHTML = "Show Table";
			}
			else{
				this.parentNode.childNodes[this.parentNode.childNodes.length-1].style.display = 'table'; 
				this.innerHTML = "Hide Table";
			}
		})
		.html('Hide Table');
	
	div.append('a')		
		.on('click', function(){ exportTableToCSV(table[0][0], this); })
		.attr('target', '_blank')
		.attr('download', 'PAS_Content.csv')
		.style('float', 'right')
		.html('Download to MS Excel');
	
	var table = div.append('table')
		.attr('class', 'table table-bordered');			
	
	return table;
}

/*
	Creates title element
	
	titleText: innerHTML value of title element
*/
function addTitle(titleText){
	d3.select('#text').append('h2')
		.html(titleText);
}

/*
	Populates tabs of help page
*/
function addContent(activeTabID){
	var content = document.getElementsByName('content');
	
	for(var child=0; child<content.length; child++){
		if(content[child].id == activeTabID){
			content[child].className = 'active';
			content[child].style.display = 'block';
		}
		else{
			content[child].className = '';
			content[child].style.display = 'none';
		}
	}
}

/*
	Populates table element with data
	
	data: data to populate table with
	table: table element to populate
*/
function populateTable(data, table){
	appendTableHeaders(table.append('thead'), Object.keys(data[0]));
	appendTableRows(table.append('tbody'), data.length, Object.keys(data[0]), data);
}

/*
	Creates table header
	
	tableElement: table element to append heading to
	headings: array of heading values
*/
function appendTableHeaders(tableElement, headings){
	var headingRow = tableElement.append('tr');

	for(var heading=0; heading<headings.length; heading++){
		if(headings[heading].indexOf('/') != -1){
			headingRow.append('th')
				.html(headings[heading].split('/')[0] + '<br>' + headings[heading].split('/')[1]);
		}
		else{
			headingRow.append('th')
				.html(headings[heading]);
		}
	}
}

/*
	Creates row and cell elements
	
	tableElement: the table element to append rows and cells to
	numberOfRows: number, total rows required in table
	headings: array of heading values
	data: data to populate cells with
*/
function appendTableRows(tableElement, numberOfRows, headings, data){
	for(var row=0; row<numberOfRows; row++){
		var currentRow = tableElement.append('tr');

		for(var heading in headings){
			currentRow.append('td')
				.html(data[row][headings[heading]]);
		}
	}
}

/*
	Sends request to server - server.json
	GET request, returns data from database query
	
	request: href for relevant server request
	response: javascript function to pass returned data to
	callback:  javascript function called when reponse function completes

	calls - roundIntValues()
		passes returned data element
		returns data element
*/
function dataRequest(request, response, table){
	$.ajax({
		url: request,
		type: 'GET',
		contentType: 'application/json',
		success: function(result) { 
			var data = roundIntValues(JSON.parse(result));
			response(data, table);
		},
		error: function(err) {
			console.log("ERROR: error getting data")
			console.log(err.getResponseHeader("status"));
		}
	});
}

/*
	Rounds all numbers within data to two decimal places
	
	data: data element to update
		returns data element with rounded numbers
*/
function roundIntValues(data){
	var keys = Object.keys(data[0]);

	for(var shifts in data){
		for(var key=0; key<keys.length; key++){
			if(keys[key].indexOf('Average') != -1){
				data[shifts][keys[key]] = parseFloat(data[shifts][keys[key]]).toFixed(2);
			}
		}
	}
	return data;
}