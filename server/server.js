var http = require('http');
var router = require('./router');

var port = 8080;
var ip = '127.0.0.1';

var server = http.createServer(router.handleRequest);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);