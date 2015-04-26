function exportTableToCSV(table, link) {
	var rows = table.rows;
	var colDelim = ',';
	var rowDelim = '\r\n';
	var text = '';
		
	for(var row=0; row<rows.length; row++){
		for(var value=0; value<rows[row].childNodes.length; value++){
			if(value != rows[row].childNodes.length-1){
				text += rows[row].childNodes[value].innerHTML.replace(/,/g, ';') + colDelim;
			}
			else{
				text += rows[row].childNodes[value].innerHTML.replace(/,/g, ';');
			}
		}
		text += rowDelim;
	}
	
	link.href = 'data:attachment/csv,' + encodeURIComponent(text);	
}