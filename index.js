var express = require('express'), 
	app = express(),
	authorName,
	dropPing,
	dropCat,
	fs = require('fs'),
	pathFile = "./superpoops.xml";
var logfmt = require("logfmt");


var attCategory;
var attRoulette = "1";
var nodeAuthor;
var nodeText;


app.use(logfmt.requestLogger());

//adds CORS support to server
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.configure( function() { 

  app.use('/js', express.static(__dirname + '/js')); 
  console.log("Express configured. Listening on port 5000");
});


// respond to web GET requests with the index.html page.
// this is how you serve a file that's not in a static directory:
app.get('/', function (request, response) {
   response.sendfile('index.html');
});

// function for serving index.html, or index. anything:
app.get('/index*', function (request, response) {
   response.sendfile('index.html');
});

app.get('/data', function (request, response) {
	response.sendfile('superpoops.xml');
});
 
// if the request is for /name/Joe, or /name/Jane, then express.js
// will treat the second element of the address string as the name:
app.post('/author/:author', function (request, response) {
	authorName  = request.params.author;
	console.log(authorName);
	nodeAuthor = authorName;
	response.end();
});

app.post('/drops/:drops', function (request, response) {
	dropPing = request.params.drops;
	console.log(dropPing);
	nodeText = dropPing;
	response.end();
});

app.post('/cat/:cat', function (request, response) {
	dropCat = request.params.cat;
		console.log(dropCat);
		attCategory = dropCat;

		xmlWhatever();
		response.end();
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

function xmlWhatever() {
	//Last Node of XML / root
	var lastNode = "</library>";
	var addNodes = "<quote category=\"" + attCategory + "\" roulette=\"" + attRoulette + "\">" + "\n" + "\t" +
	"<author>" + nodeAuthor + "</author>" + "\n" + "\t" +
	"<text>" + nodeText + "</text>" + "\n" +
	"</quote>" + "\n" + "\n" +
	"</library>";
	
	fs.readFile(pathFile, 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  var result = data.replace(lastNode, addNodes);
	
	  fs.writeFile(pathFile, result, 'utf8', function (err) {
	     if (err) {
	     return console.log(err);
	     response.send(err); //prints error in front end console
    	} else {
      		console.log("JSON saved to " + pathFile);
      		response.send(result); //prints data in front end console
      	}
	  });
	});
}
