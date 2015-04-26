/*
	MODULES REQUIRED 
	Install through npm: https://www.npmjs.com/
	Documentation: https://docs.npmjs.com/
*/
var express = require('express');
var app = express();
var path = require('path');
var mysql = require('mysql');

/*
	CONFIGURE
	Express module needs to know the root of the project
	Root: __dirname(current directory) + /public
*/
var filedir = path.join(__dirname, 'public');
app.use(express.static(filedir));

/*
	SERVER PORT
	The server listens on port specified
	By env var PORT: if set by pm2 at deployment
	Otherwise: 3900
*/
var port = process.env.PORT || 3901;
app.listen(port);
console.log("listening on %d...", port);

/*
	DATABASE CONNECTION DETAILS
	mysql module requires connection details for database
*/
var connection = mysql.createConnection({
  host     : 'ephesus.cs.cf.ac.uk',
  user     : 'c1106417',
  password : 'emmerdale12345'
});

/*
	NAVIGATION - GLOBAL VARIABLES
	Made global to prevent code duplication
*/
var options = {
	root: filedir,
	dotfiles: 'deny',
	headers: {
		'x-timestamp': Date.now(),
		'x-sent': true
	}
};

/*
	NAVIGATION
	Following GET requests serve the requested web page
	Called by: Navigation bar on web pages
*/
app.get("/Product/:page", function(req, res){
	var fileName;
	
	switch(req.params.page){
		case 'A':
			fileName = 'productPageA.html';
			break;
		case 'B':
			fileName = 'productPageB.html';
			break;
	}
	
	res.sendFile(fileName, options, function (err) {
		if (err) {
		  console.log(err);
		  res.status(err.status).end();
		}
		else {
		  console.log('Sent:', fileName);
		}
	});
});

app.get("/help", function(req, res){
	var fileName = 'helpPage.html';
	
	res.sendFile(fileName, options, function (err) {
		if (err) {
		  console.log(err);
		  res.status(err.status).end();
		}
		else {
		  console.log('Sent:', fileName);
		}
	});
});

/*
	DATABASE QUERIES
	Following requests the server to query the database
	Uses connection created at start of server.js
	Returns stringified JSON object of query result
	
	Uses mysql module - https://www.npmjs.com/package/mysql
	and req.params - http://expressjs.com/api.html#req.params
	
	Called by: Selecting tabs on web pages
*/

app.get("/dailyBreakDown/:product", function(req, res){
	switch(req.params.product){
		case 'A':
			connection.query('SELECT * FROM  c1106417.DailyAnalysis_A', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
		case 'B':
			connection.query('SELECT * FROM  c1106417.DailyAnalysis_B', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
		case 'shiftGroupA':
			connection.query('SELECT * FROM  c1106417.DailyAnalysis_ShiftGroups_A', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
		case 'shiftGroupB':
			connection.query('SELECT * FROM  c1106417.DailyAnalysis_ShiftGroups_B', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
	}
});

app.get("/groupBreakDown/:product", function(req, res){
	switch(req.params.product){
		case 'A':
			connection.query('SELECT * FROM c1106417.GroupAnalysis_A', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
		case 'B':
			connection.query('SELECT * FROM c1106417.GroupAnalysis_B', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
	}
});

app.get("/patternBreakDown/:product", function(req, res){
	switch(req.params.product){
		case 'B':
			connection.query('SELECT * FROM c1106417.PatternAnalysis_B', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
	}
});

app.get("/summary/:product", function(req, res){
	switch(req.params.product){
		case 'A':
			connection.query('SELECT * FROM c1106417.Summary_A', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
		case 'B':
			connection.query('SELECT * FROM c1106417.Summary_B', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
	}
});

app.get("/dailyPerformance/:product", function(req, res){
	switch(req.params.product){
		case 'A':
			connection.query('SELECT * FROM c1106417.DailyReject_A', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
		case 'B':
			connection.query('SELECT * FROM c1106417.DailyReject_B', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
	}
});

app.get("/monthlyPerformance/:product", function(req, res){
	switch(req.params.product){
		case 'A':
			connection.query('SELECT * FROM c1106417.MonthlyReject_A', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
		case 'B':
			connection.query('SELECT * FROM c1106417.MonthlyReject_B', function(err, rows, fields) {
			  if (err) throw err;
			  res.end(JSON.stringify(rows));
			});
			break;
	}
});

app.post('/getCSV', function(req, res){
	console.log(req);
});