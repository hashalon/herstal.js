/**
 * Player informations for both server and client
 * name of the player and its colors: primary, secondary and laser
 */

 function Player(id, name, colors){
	 this.id = id;
     this.name = name;
     this.colors = colors;
     this.team = "none";
 }
 Player.prototype.constructor = Player;

Player.prototype.createCharacter = function(position, orientation){
    this.character = new Character(this, position, orientation, {team: this.team});
};
