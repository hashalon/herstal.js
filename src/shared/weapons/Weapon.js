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
		var team = options.team || "none";
		// should we use self_ group and mask ?
		var isSelf = this.character.player.current ? "self_" : "";
		var filter = Weapon.FILTERS[isSelf+team] || Weapon.FILTERS.none;
		var fg = options.filterGroup, fm = options.filterMask;
		this.filterGroup = fg != null ? fg : filter.group;
		this.filterMask  = fm != null ? fm : filter.mask ;
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
HERSTALshared.Weapon = Weapon;

Weapon.FILTERS = {
	none  : { group: 0b1, mask: 0b1 },
	alpha : { group: 0b1, mask: 0b1 },
	beta  : { group: 0b1, mask: 0b1 },
	self_none  : { group: 0b1, mask: 0b1 },
	self_alpha : { group: 0b1, mask: 0b1 },
	self_beta  : { group: 0b1, mask: 0b1 },
};
