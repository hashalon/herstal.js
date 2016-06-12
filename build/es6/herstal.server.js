(function(undefined) {

// parameters for the app
var options = options || {};
var pathShared = './herstal.shared.js' || './herstal.shared.js';
var pathCannon = '../../lib/cannon.min.js' || './cannon.js';

var port = 8080; // we correct the port
var name = "unnamed server";
var nbPlayers = 8; // we correct the number of players
// if maps is null or empty
var maps = ["base"];
// if modes is null or empty
var modes = ["default"];

var http = require('http');
var fs   = require('fs');

var server = http.createServer(function(req, res){

});

var io = require('socket.io').listen(server);

// there is no need in using a minified file for the server
var CANNON  = require(pathCannon); // herstal needs cannon.js
var HERSTAL = require(pathShared);
if(!HERSTAL) throw new Error('Herstal.server needs Herstal.shared to work');

io.sockets.on('connection', function(socket){
	console.log();
});

server.listen(port);

module.exports = {  };
})();