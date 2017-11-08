var http = require('http');
var router = require('./router');

var port = 8080;
var ip = '127.0.0.1';

var server = http.createServer(router.handleRequest);

console.log("Listening on http://" + ip + ":" + port);

server.listen(port, ip);

responseList = {
	'index' : function(data){
		var response = {};
		responde.page = 'index';
		return response;
	},
	'page1' : function(data){
		var response = {};
		response.page = 'uno';
		response.headers = {
			"access-control-allow-origin": "*",
			"access-control-allow-methods": "GET, POST, PUT, DELETE",
			"access-control-max-age": 333,
			"Content-Type": "application/json"
		};
		return response;
	},
	'page2' : function(data){
		var response = {};
		response.page = 'due';
		return response;
	},
	'page3' : function(data){
		var response = {};
		response.page = 'tre';
		return response;
	},
	'page4' : function(data){
		var response = {};
		response.page = 'quattro';
		return response;
	},
	'page5' : function(data){
		var response = {};
		response.page = '<button id="cinque">cinque</button>';
		return response;
	},
	'page7' : function(data){
		var response = {};
		response.page = '<html><head><script></script></head><body>sette</body></html>';
		return response;
	},
	'page6' : function(data){
		var response = {};
		response.page = 'sei';
		return response;
	},
	'page8' : function(data){
		var response = {};
		response.page = 'otto';
		return response;
	},
	'page9' : function(data){
		var response = {};
		response.page = 'nove';
		return response;
	}
};