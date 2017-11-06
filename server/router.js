var path = require('path');
var url = require('url');
var headers = {
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET, POST",
	//"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
	"access-control-allow-headers": "content-type, accept",
	//"access-control-max-age": 10,
	"Content-Type": "application/json"
};

prepareResponse = function(req, cb){
	var data = "";
	req.on('data', function(chunk) { data += chunk; });
	req.on('end', function() { cb(data); });
}

respond = function(res, data, status = 200) {
	res.writeHead(status, headers);
	res.end(data);
}

send404 = function(res){
	respond(res, 'Not Found', 404);
}

redirector = function(res, loc, status = 302){
	res.writeHead(status, { Location: loc });
	res.end();
}

var actions = {
	'GET': function(req, res) {
		/* if your router needs to pattern-match endpoints
		 * var parsedUrl = url.parse(req.url);
		 * var endPoint = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
		*/
		/*
		 * DO SOMETHING - get asset, query database, etc. -> store as `data`
		 * pass the result of that operation as data into responder -> store result status code as `statusCode`
		 * pass the status code into responder
		*/
		var data = {};
		var minRes = url.parse(req.url);
		data.route = minRes.pathname.split('/');
		data.route.shift();
		if(minRes.query != null){
			data.arguments = minRes.query.split("&").reduce(function(obj,item){
				var splitted = item.split('=');
				obj[splitted[0]] = splitted[1];
				return obj;
			}, {});
		}
		console.log(data);
		respond(res, "fatto");
	},
	'POST': function(req, res) {
		prepareResponse(req, function(data) {
			// Do something with the data that was just collected by the helper
			// e.g., validate and save to db
			// either redirect or respond
			// should be based on result of the operation performed in response to the POST request intent
			// e.g., if user wants to save, and save fails, throw error
			//redirector(res, /* redirect path , optional status code -	defaults to 302 */);
			respond(res, data);
		});
	}
}; 

exports.handleRequest = function(req, res) {
	var action = actions[req.method];
	action ? action(req, res) : send404(res);
};