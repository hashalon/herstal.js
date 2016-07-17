/**
Base class for all weapons
@class Weapon
*/
class Weapon {
	/**
	@constructor
	@param {String}    name      The name of the weapon
	@param {Character} character The character holding the weapon
	@param
	*/
	constructor(name, character, options){
		options = options || {};

		// id of the weapon for multiplayer identification
		this.id = null;
		// world in which the weapon exists
		this.world = character.world;

		// name of the weapon and character using it
		this.name      = name;
		this.character = character;

		// damage dealt by the weapon if raycast or too close range
		this.damage    = options.damage || 0;
		// if maxAmmo is set and greater than 0
		if(options.maxAmmo > 0){
			this.ammo    = options.ammo;
			this.maxAmmo = options.maxAmmo;
		}
		this.firerate = options.firerate > 0 ? options.firerate : 60;
		this.acquired = !options.notAcquired;

		// which group and mask should we use for this weapon ?
		var team = options.team || this.character.team;
		var filter = HERSTAL.TEAM.getCollisionFilter(team);
		this.filterGroup = options.filterGroup || filter.group;
		this.filterMask  = options.filterMask  || filter.mask ;
	}

	/**
	Method called when the weapon is equiped and the player press fire1
	@method fire
	*/
	fire(){}

	/**
	Method called when the weapon is equiped and the player press fire2
	@method secondary
	*/
	secondary(){}
}
// we add the class to the Namespace
HERSTAL.Weapon = Weapon;
