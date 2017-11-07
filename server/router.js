const path = require('path');
const url = require('url');
const sitemap = require('./sitemap');
//const util = require('util');

var headers = {
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET, POST",
	//"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
	"access-control-allow-headers": "content-type, accept",
	//"access-control-max-age": 10,
	//"Content-Type": "application/json"
};

console.log(JSON.stringify(sitemap, null, 2));

prepareResponse = function(req, cb){
	var data = "";
	req.on('data', function(chunk) { data += chunk; });
	req.on('end', function() { cb(data); });
}

respond = function(res, data, status = 200) {
	res.writeHead(status, headers);
	res.write(data);
	res.end();
}

send404 = function(res){
	respond(res, 'Not Found', 404);
}

redirector = function(res, loc, status = 307){
	res.writeHead(status, { Location: loc });
	res.end();
}

var actions = {
	'GET': function(req, res) {
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
		if(data.route[0] === "index")
			redirector(res,"/public/index.html");
		else
			respond(res, "<div>fatto</div>");
	},
	'POST': function(req, res) {
		prepareResponse(req, function(data) {
			//redirector(res, /* redirect path , optional status code -	defaults to 302 */);
			//respond(res, data);
		});
	}
}; 

exports.handleRequest = function(req, res) {
	/**/
	if(req.url === '/favicon.ico'){
		res.writeHead(200, {'Content-Type': 'image/x-icon'} );
		res.end();
		console.log('favicon requested');
		return;
	}
	/**/
	var action = actions[req.method];
	action ? action(req, res) : send404(res);
};