// server.js

var express = require('express');
var http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var app = express();

var data = {};

function buildDataJSON(html) {
    html = html.toString().trim();
    html = html.substring(html.search("{\"data\"")).trim();
    html = html.substring(0, html.search("]}]}") + "]}]}".length).trim();
    return JSON.parse(html);
  }

function fetchData () {
	console.log("Fetching data...");

	var xhr1 = new XMLHttpRequest();
	var url1 = "http://www.fib.upc.edu/fib/estudiar-enginyeria-informatica/matricula/lliures/lliuresGRAU.html";
	xhr1.open("GET", url1, false);
	xhr1.onreadystatechange = function() {
		console.log("Resposta: " + xhr1.status + ", Mida resposta: " + xhr1.responseText.length);
		altres = buildDataJSON(xhr1.responseText);
		xhr2 = new XMLHttpRequest();
		var url2 = "http://www.fib.upc.edu/fib/estudiar-enginyeria-informatica/matricula/lliures/lliuresFS.html";
		xhr2.open("GET", url2, false);
		xhr2.onreadystatechange = function() {
			console.log("Resposta: " + xhr2.status + ", Mida resposta: " + xhr2.responseText.length);
			faseInicial = buildDataJSON(xhr2.responseText);
			assigs = faseInicial["assigs"].concat(altres["assigs"]);
		}
		xhr2.send();
	}
	xhr1.send();
}

setInterval(function(){ fetchData() }, 1*60*1000);
fetchData();

app.get('/data', function(req, res, next) {
    res.json(assigs);
});

http.createServer(app).listen(8080, function(){
    console.log('Listening on port 8080');
});
