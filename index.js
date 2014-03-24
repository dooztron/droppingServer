var express = require('express'), 
	app = express(),
	authorName,
	dropPing,
	dropCat,
	fs = require('fs'),
	url = require('url'),
	pathFile = "./game.xml";
var logfmt = require("logfmt");


var attCategory;
var attRoulette = "1";
var nodeAuthor;
var nodeText;
var recordedResponse;


app.use(logfmt.requestLogger());


//adds CORS support to server
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.configure( function() { 

  app.use('/js', express.static(__dirname + '/js')); 
  console.log("Express configured. Listening on port 8080");
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

app.get('/thanks', function (request, response) {
	response.sendfile('thanks.html');
	response.send(recordedResponse);
});

app.get('/data', function (request, response) {
	response.sendfile('game.xml');
});

app.post('/logdata/cat/:cat/author/:author/drops/:drops', function (request, response) {
	dropCat = request.params.cat;
	authorName  = request.params.author;
	dropPing = request.params.drops;

		console.log(dropCat);
		console.log(authorName);
		console.log(dropPing);

		attCategory = dropCat;
		nodeAuthor = authorName;
		nodeText = dropPing;

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
	  recordedResponse = result;
	
	  fs.writeFile(pathFile, result, 'utf8', function (err) {
	     if (err) {
	     return console.log(err);
    	} else {
      		console.log("XML saved to " + pathFile);
      	}
	  });
	});
}
