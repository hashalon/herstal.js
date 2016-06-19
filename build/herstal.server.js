'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {
	var HERSTALserver = {};

	// we expose our module
	module.exports = HERSTALserver;

	// there is no need in using a minified file for the server
	// but the files needs to be in the same directory
	var HTTP = require('http');
	var SOCKETIO = require('socket.io');
	var HERSTALshared = require('./herstal.shared.js');

	if (!HTTP) throw new Error('herstal.server needs http to manage requests');
	if (!SOCKETIO) throw new Error('herstal.server needs socketio to work');
	if (!HERSTALshared) throw new Error('herstal.server needs herstal.shared to work');

	/**
  * main object to manage connections
  */
	function Server(name, port, maxPlayers, maps, modes) {

		this.name = typeof name === "string" ? name : "unnamed server";
		this.port = port > 0 ? port : 8080;
		this.maxPlayers = maxPlayers > 0 ? maxPlayers : 8;

		// if maps is a array
		this.maps = ["base"];
		if ((typeof maps === 'undefined' ? 'undefined' : _typeof(maps)) === "object") {
			// if the array is not empty
			if (maps.length > 0) this.maps = maps;
		}
		// if modes is a array
		this.modes = ["default"];
		if ((typeof modes === 'undefined' ? 'undefined' : _typeof(modes)) === "object") {
			// if the array is not empty
			if (modes.length > 0) this.modes = modes;
		}

		var server = HTTP.createServer(function (req, res) {});
		var io = SOCKETIO.listen(server);

		io.sockets.on('connection', function (socket) {
			console.log();
		});

		server.listen(port);
	}
	// we add the class to the module
	HERSTALserver.Server = Server;
	Server.prototype.constructor = Server;
})();