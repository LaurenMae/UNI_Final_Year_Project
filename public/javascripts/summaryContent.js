/*
	Splits summary data by best/worst value,
	sends split data sections to different JavaScript
	functions
	
	data: data set returned by database query
*/
function buildSummaryContent(data){
	addTitle("Summary of Environmental Factor Analysis");
	for(var item in data){
		var dataObj = [];
		dataObj.push(data[item]);
		
		if(data[item].Best == 0){
			worstConditions(dataObj, getActiveTab(false));
		}
		else{
			bestConditions(dataObj, getActiveTab(false));
		}
	}
}

/*
	Creates the section of summary page containing most profitable environment
	
	data: data set returned by database query
	product: the current tab ID
*/
function bestConditions(data, product){
	addTitle("Best Cost of Production");
	populateTable(data, createTable());
	appendText(data, data[0].Best);
}

/*
	Creates the section of summary page containing least profitable environment
	
	data: data set returned by database query
	product: the current tab ID
*/
function worstConditions(data, product){
	addTitle("Worst Cost of Production");
	populateTable(data, createTable());
	appendText(data, data[0].Best);
}

function appendText(data, condition){
	// Add english explanation of environmental factors in tables.
	var div = d3.select('#text');
	
	if(condition == 0){
		var text = data[0].Month + " is the least profitable month for production. <br>"
			+ data[0].Day + "'s are the least profitable day of the week, with Shift Group " +
			data[0].Group + " being the least productive.<br>";
			
		if(data[0]['Shift Pattern'] == ''){
			text += " There is no significant profitability difference between night and day shifts."
		}
		else{
			if(data[0]['Shift Pattern'].indexOf('D') != -1){
				text += " Day shifts are significantly less profitable than night shifts.";
			}
			else{
				text += " Night shifts are significantly less profitable than day shifts.";
			}
		}
	}
	else {
		var text = data[0].Month + " is the most profitable month for production. <br>"
			+ data[0].Day + "'s are the most profitable day of the week, with Shift Group " +
			data[0].Group + " being the most productive.<br>";
			
		if(data[0]['Shift Pattern'] == ''){
			text += " There is no significant profitability difference between night and day shifts."
		}
		else{
			if(data[0]['Shift Pattern'].indexOf('D') != -1){
				text += " Day shifts are significantly more profitable than night shifts.";
			}
			else{
				text += " Night shifts are significantly more profitable than day shifts.";
			}
		}
	}
	
	div.append('text')
			.html(text);
}