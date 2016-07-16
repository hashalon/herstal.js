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
	constructor(id, name, options){
		options = options || {};
		this.id   = id;
	    this.name = name;
		this.team = "none";

		this.character = null; // character of the player
		this.current   = null; // is it the current player ?

	    this.colors = options.colors;
	    this.model  = options.model;
		this.weaponAutoSwitch = options.weaponAutoSwitch;
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
	}
}
HERSTAL.Player = Player;
