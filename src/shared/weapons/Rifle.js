/**
Base class for raycasting weapon
@class Rifle
*/
class Rifle extends HERSTAL.Weapon {
	/**
	@constructor
	@param {String} name The name of the rifle
	@param {Character} character The character holding the weapon
	@param {Object} options The configuration of the weapon
	*/
	constructor(name, character, options){
		options = options || {};
		super(name, character, options);

	}
}
HERSTAL.Rifle = Rifle;
