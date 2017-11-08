const path = require('path');
const url = require('url');
const sitemap = require('./sitemap');
/**
"siteUrl" : "http://127.0.0.1:8080",
"index" : "/public/index.html",
/**/
exports.defaultHeaders = {
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET",
	//"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
	"access-control-allow-headers": "content-type, accept",
	"access-control-max-age": 10,
	//"Content-Type": "application/json"
};

//console.log(JSON.stringify(sitemap, null, 2));

prepareResponse = function(req, cb){
	var data = "";
	req.on('data', function(chunk) { data += chunk; });
	req.on('end', function() { cb(data); });
};

respond = function(res, data, head = exports.defaultHeaders, status = 200) {
	console.log(head);
	res.writeHead(status, head);
	res.write(data);
	res.end();
	console.log(status);
};

send404 = function(res){
	respond(res, 'Not Found',exports.defaultHeaders, 404);
};

redirector = function(res, loc, status = 302){
	if(loc[0] === "/"){
		loc = sitemap.siteUrl + loc;
	}
	res.writeHead(status, { Location: loc });
	res.end();
	console.log(status+" -> "+loc);
};

makeReqObj = function(req){
	var ReqObj = {};
	ReqObj.data = {};
	var minRes = url.parse(req.url);
	ReqObj.data.route = minRes.pathname.split('/');
	ReqObj.data.route.shift();
	if(minRes.query != null){
		ReqObj.data.arguments = minRes.query.split("&").reduce(function(obj,item){
			var splitted = item.split('=');
			obj[splitted[0]] = splitted[1];
			return obj;
		}, {});
	}
	var check = ReqObj.data.route.reduce(function(anchor,item){
		return anchor[item];
	},sitemap.routing);
	
	if(typeof check !== "undefined" && (typeof check.cb !== "undefined" || typeof check.redirect !== "undefined")){
		ReqObj.cb = check.cb;
		ReqObj.redirect = check.redirect;
	}
	else if(minRes.pathname === "/"){
		ReqObj.cb = "index";
	}
	else{
		ReqObj = false;
	}
	return ReqObj;
};

var actions = {
	'GET': function(req, res) {
		
		var ReqObj = makeReqObj(req);
		console.log(ReqObj);
		
		if(ReqObj){
			//console.log(ReqObj.cb);
			if(ReqObj.redirect){
				if(ReqObj.cb)
					responseList[ReqObj.cb];
				redirector(res,ReqObj.redirect);
			}else{
				var cb = responseList[ReqObj.cb];
				if(cb){
					var response = cb(ReqObj.data);
					respond(res, response.page, response.headers);
				}else
					send404(res);
			}
		}else{
			send404(res);
		}
	},
	/**/
	'POST': function(req, res) {
		prepareResponse(req, function(data) {
			//redirector(res,path,302);
			//respond(res, data);
		});
	}
	/**/
}; 


exports.indexPage = sitemap.index;

exports.handleRequest = function(req, res) {
	var action = actions[req.method];
	action ? action(req, res) : send404(res);
};