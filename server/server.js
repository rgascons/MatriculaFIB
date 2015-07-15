// server.js

var express = require('express');
var http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var app = express();

var data = JSON.parse("{}");



function buildDataJSON(html) {
    html = html.toString().trim();
    html = html.substring(html.search("{\"data\"")).trim();
    html = html.substring(0, html.search("]}]}") + "]}]}".length).trim();
    return JSON.parse(html);
  }

function fetchData () {
	console.log("Fetching data...");

	var xhr = new XMLHttpRequest();
	var url = "http://www.fib.upc.edu/fib/estudiar-enginyeria-informatica/matricula/lliures/lliuresGRAU.html";
	xhr.open("GET", url, false);
	xhr.onreadystatechange = function() {
		console.log("Resposta: " + xhr.status + ", Mida resposta: " + xhr.responseText.length);
		data = buildDataJSON(xhr.responseText);
	}
	xhr.send();
}

setInterval(function(){ fetchData() }, 10*60*1000);
fetchData();

app.get('/data', function(req, res, next) {
    //res.status(200).send("{'molta informacio': 'oi que si?'}");
    res.json(data);
});

http.createServer(app).listen(8080, function(){
    console.log('Listening on port 8080');
});