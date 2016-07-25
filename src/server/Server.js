/*
to run this script type for example:
node herstal.server.js -name "MyServer" -port 8080 -max 16
*/

// we recover the args for the app
var ARGUMENTS = require('minimist')(process.argv.slice(2)),
	help = '\nWelcome in Herstal.js, here is a list of parameter you could use:\n'
		+' -name  : specify the name of the server\n'
		+' -port  : specify the port number of the server\n'
		+' -max   : specify the maximum number of player who can join the server\n'
		+' -maps  : specify the maps rotation (format: "map1;map2;map3")\n'
		+' -modes : specify the game modes rotation (format: "mode1;mode2;mode3")\n'
		+'each times a new game start the next map will be loaded and the next mode will be selected\n'
;

// we need to be able to read parameters to make the server work
if(!ARGUMENTS){
	throw new Error('Missing minimist to be able to read command parameters');
	ARGUMENTS = {};
}

// if the user wants to display the help
if(ARGUMENTS.help != null){
	console.log(help); // we display the help
	process.exit(0);   // we quit the program
}

// if maps or game modes are not set
if(typeof ARGUMENTS.maps  !== "string") ARGUMENTS.maps  = "base";
if(typeof ARGUMENTS.modes === "string") ARGUMENTS.modes = "default";

// we create our module
module.exports = HERSTAL = {};

// configuration of the server
/**
Manage the state of the server
@element SERVER
*/
var SERVER = {
	fps:   60,                          // frame per second
	name:  ARGUMENTS.name || "unnamed", // name of server
	port:  ARGUMENTS.port || 4040,      // server port
	maps:  ARGUMENTS.maps .split(";"),  // list of maps
	modes: ARGUMENTS.modes.split(";"),  // list of game modes
};
SERVER.currentMap  = SERVER.maps [0];
SERVER.currentMode = SERVER.modes[0];


// we create the server
var server = HTTP.createServer(function(req, res){
	// send file to client here if necessary
});

// we load socket IO
var IO = SOCKETIO.listen(server);

// when a client connect
IO.sockets.on('connection', function(socket){

	// allow us to know if the client should be ejected
	var ejectClient = false;

	// we recover the configuration of the player
	socket.on('new_player', function(data){
		// since the data come from a client, we need to be careful
		if(typeof data === "object" && data !== null){
			// we create a new player to store in the list
			var player = HERSTAL.Player.addPlayer(data);
			// we store the player in the socket
			if(player !== null){
				socket.player = player;
			}else{ // if player creation failed
				socket.disconnect(true); // close connection
				ejectClient = true; // we eject the client
			}
		}else ejectClient = true; // eject the client
	});

	// if the client needs to be ejected
	if(ejectClient) return null;

	// we send the data necessary to init the game client side
	socket.emit('init_game', {
		id:      socket.player.id, // we return the id of the player
		fps:     SERVER.fps,  // we send the update rate to the client
		name:    SERVER.name, // name of the server
		map:     SERVER.map,  // the current map name
		mode:    SERVER.mode, // the current game mode name
		// list of players (id name model color)
		players: HERSTAL.Player.getListInfo(),
	});

	socket.on('inputs', function(inputs){
		// if the player has a character
		var character = socket.player.character;
		if(character !== null){
			// we set it's inputs
			character.setInputFromJSON(inputs);
		}
	});

});

// server will listen to request sent on the given port
server.listen(CONFIG.port);
