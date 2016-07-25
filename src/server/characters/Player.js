/**
Player informations for both server and client
@class Player
*/
class Player {
	/**
	@constructor
	@param {Number} id The id of the player
	@param {String} name The name of the player
	@param {Object} options Configuration of the player
	*/
	constructor(options){
		options = options || {};

		// general identification of the player
		this.id    = Player.idCounter++;
	  this.name  = typeof options.name === "string" ? options.name : "unnamed";
		this.team  = typeof options.team === "number" ? options.team : 0;
		this.model = options.model || 0;

		// select the color to use
		this.colorPlayer = options.colorPlayer || "#888888";
		this.colorLaser  = options.colorLaser  || "#e3ff00";

		// does the character switch of weapon on pickup
		this.weaponAutoSwitch = !!options.weaponAutoSwitch;

		// the character of the player
		this.character = null;
	}
	/**
	@method createCharacter
	@param {Vec3} position The foot position of the character in the map
	@param {Number} orientation The orientation of the character
	@return {Character} The character to add to the map
	*/
	createCharacter(position, orientation){
		this.character = new Character(this, position, orientation, {
			team: this.team,
		});
		// we return the character
		return this.character;
	}
}
HERSTAL.Player = Player;

// maximum number of player for the server (we need atleast one)
Player.maxPlayers = ARGUMENTS.max > 0 ? ARGUMENTS.max : 8;

// keep track of the last id to use
Player.idCounter = 0;

// list of the player of the game
Player.players = [];

/**
Add a player to the list based on the data recieved from the socket
we can override this method to change the parameters
@method addPlayer
@param {Object} data the configuration of the player
@return {Player} the player we just created
*/
Player.addPlayer = function(data){
	// as long as the number of players connected is smaller than the limit
	if(this.players.length < this.maxPlayers){
		// we create a new player
		var player = new HERSTAL.Player({
			name:  data.name,  // name of the player
			model: data.model, // model to use for the player (number|string)
			colorPlayer: data.color1, // color of the player
			colorLaser:  data.color2,  // color of the laser of the player
			weaponAutoSwitch: data.weapAuto, // switch weapon on pickup
		});
		// we add the player to the list
		this.players[this.players.length] = player;
		// we return the newly created player
		return player;
	}
	return null;
};

/**
Get a player based on his id
*/
Player.getPlayer = function(id){
	// for each element of the array
	for(var i=0; i<this.players.length; ++i){
		// if ids match, it is our player
		if(this.players[i].id === id) return this.players[i];
	}
	return null; // player not found
};

/**
Get a list of the players with their data
*/
Player.getListInfo = function(){
	var list = [];
	for(var i=0; i<this.players.length; ++i){
		var player = this.players[i];
		// we recover the id of the character attached to the player (-1 if null)
		var character = player.character !== null ? player.character.id : -1;
		list[list.length] = {
			id:     player.id,
			name:   player.name,
			team:   player.team,
			model:  player.model,
			color1: player.colorPlayer,
			color2: player.colorLaser,
			char:   character,
		};
	}
	return list;
};
