// we generate a connection to the server
var SOCKET = io.connect(HERSTAL.SERVER_ADDRESS);

// we recover the config defined by the user
var config = HERSTAL.CONFIG.preferences;

// we send data about this player to the server
SOCKET.emit('new_player', {
	name:     config.name,  // name of the player
	model:    config.model, // model used by the player
	color1:   config.colorPlayer, // primary color of the player
	color2:   config.colorLaser,  // laser color for instangib
	weapAuto: config.weaponAutoSwitch, // autoswitch weapon on pickup
});

var CLIENT = HERSTAL.CLIENT = {};

// we init the game client side
SOCKET.on('init_game', function(init){
	// the current player of the client
	CLIENT.player = new HERSTAL.CurrentPlayer(init.id);

	CLIENT.fps  = init.fps;  // how fast the client should update
	CLIENT.name = init.name; // name of the server
	CLIENT.map  = init.map;  // current map
	CLIENT.mode = init.mode; // current game mode
	CLIENT.players = init.players; // list of the players
});

// receive data from the server
SOCKET.on('states', function(state){

});

// send data to the server
//SOCKET.emit('inputs', inputs);
