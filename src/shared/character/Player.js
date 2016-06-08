/**
 * Player informations for both server and client
 * name of the player and its colors: primary, secondary and laser
 */
 function Player(name, colors){

	 this.id = Player.currentId++;
 }
 Player.prototype.constructor = Player;

 Player.currentId = 0;
