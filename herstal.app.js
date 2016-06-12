/*
to run this script type for example:
node herstal.app.js -port 8080 -name "MyServer" -max 16
node herstal.app.js -psv "./build/es6/herstal.server.js" -psh "./build/es6/herstal.shared.js" -pca "./lib/cannon.js"
*/

// we recover the args for the app
var args = require('minimist')(process.argv.slice(2)),
	help = '\nWelcome in Herstal.js, here is a list of parameter you could use:\n'
		+' -port  : specify the port number of the server\n'
		+' -name  : specify the name of the server\n'
		+' -max   : specify the maximum number of player who can join the server\n'
		+' -maps  : specify the maps rotation (format: "map1;map2;map3")\n'
		+' -modes : specify the game modes rotation (format: "mode1;mode2;mode3")\n'
		+'each times a new game start the next map will be loaded and the next mode will be selected\n'
		+' -psv : path to herstal.server.js\n'
		+' -psh : path to herstal.shared.js\n'
		+' -pca : path to cannon.js\n'
;

// we need to be able to read parameters to make the server work
if(!args){
	throw new Error('Missing minimist to be able to read command parameters');
	args = {};
}

// if the user wants to display the help
if(args.help != null){
	console.log(help); // we display the help
	process.exit(0);   // we quit the program
}

if(typeof args.maps  !== "string") args.maps  = "base";
if(typeof args.modes !== "string") args.modes = "default";

var pathServer = args.psv || './herstal.server.js';

// those variable will passed on the module SERVER
var OPTIONS = {
	ServerPort : args.port,
	ServerName : args.name,
	MaxPlayers : args.max,
	MapNames   : args.maps.split(";"),
	GameModes  : args.modes.split(";"),
	pathShared : args.psh,
	pathCannon : args.pca,
};
var SERVER = require(pathServer);
