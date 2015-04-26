/*
	Retrieves the tab with className 'active'
	
	show: determines whether to display content of
		active tab or return its ID value
	
*/
function getActiveTab(show){
	var tabs = document.getElementsByName('tab');

	for(var tab in tabs){
		if(tabs[tab].className == 'active'){
			if(show){
				showTabContent(tabs[tab].id);
			}
			else{
				return tabs[tab].id;
			}
		}
	}
}

/*
	Called when web page tabs are clicked
	
	Removes className 'active' from all tab elements
	Sets className of element with ID tabID to 'active'
	
	tabID: tab element selected ID
*/
function changeActiveTab(tabID){
	var tabs = document.getElementsByName('tab');
	
	for(var tab in tabs){
		if(tabs[tab].className == 'active'){
			tabs[tab].className = '';
		}
	}	
	document.getElementById(tabID).className = 'active';
	showTabContent(tabID);
}

/*
	Displays the content of the current tab
	Removes current tab content
	
	Calls table and graph scripts via callbacks - http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/
	
	activeTabID: ID of activeTab or href of content to display
*/
function showTabContent(activeTabID){
	var product = activeTabID.split('')[0].toUpperCase();
	
	if(product == 'H'){
		addContent(activeTabID);
	}
	
	switch (true) {
		case /Summary/.test(activeTabID):
			replacePreviousContent();
			dataRequest('/summary/' + product, buildSummaryContent);
			break;
		case /Daily/.test(activeTabID):
			replacePreviousContent();
			addDailyTable(product);
			dataRequest('/dailyBreakDown/' + product, drawBarLineChart, drawBarLineChart);
			break;
		case /subs/.test(activeTabID):	
			addGroupTable('shiftGroup' + product, null, 'Daily Breakdown of Shift Distribution');
			dataRequest('/dailyBreakDown/shiftGroup' + product, drawGroupedBarChart);
			break;
		case /Group/.test(activeTabID):
			replacePreviousContent();
			addGroupTable(product);
			dataRequest('/groupBreakDown/' + product, drawBarLineChart, drawBarLineChart);
			break;
		case /Pattern/.test(activeTabID):
			replacePreviousContent();
			addPatternTable(product);
			dataRequest('/patternBreakDown/' + product, drawGroupedBarLineChart, drawGroupedBarLineChart);
			break;
		case /Perf/.test(activeTabID):
			replacePreviousContent();
			addPerformanceTable(product, 'Daily');
			dataRequest('/dailyPerformance/' + product, drawGroupedBarLineChartPerf, function(){ showTabContent('aMonth'); });
			break;
		case /Month/.test(activeTabID):
			addPerformanceTable(product, 'Monthly');
			dataRequest('/monthlyPerformance/' + product, drawGroupedBarLineChartPerf);
			break;
	}
}

/*
	Removes current content of div with ID 'text'
*/
function replacePreviousContent(){
	document.getElementById("text").innerHTML = '';
}

/*
	Sends request to server - server.json
	GET request, returns data from database query
	
	request: href for relevant server request
	response: javascript function to pass returned data to
	callback:  javascript function called when reponse function completes	
*/
function dataRequest(request, response, callback){
	$.ajax({
		url: request,
		type: 'GET',
		contentType: 'application/json',
		success: function(result) {
				response(JSON.parse(result), callback);
			},
		error: function(err) {
				console.log("ERROR: error getting data")
				console.log(err.getResponseHeader("status"));
			}
	});
}