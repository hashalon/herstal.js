/**
The character of the current player
@class CurrentCharacter
*/
class CurrentCharacter{
	/**
	@constructor
	@param {Number} id The id of the character
	@param {CurrentPlayer} player The current player
	@param {Vector3} position The position of the character at start
	@param {Vector2} orientation The orientation of the camera
	@param {Object} options Configuration of the character
	*/
	constructor(id, player, position, orientation, options){
		options = options || {};

		this.id = id;
		this.player = player;
		this.position = position;
	}
}
HERSTAL.CurrentCharacter = CurrentCharacter;
