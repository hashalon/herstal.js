/**
Base class for Projectiles based weapons
@class Launcher
@extends Weapon
*/
class Launcher extends HERSTAL.Weapon {
	/**
	@constructor
	@param {String} name The name of the weapon
	@param {Character} character The character holding the weapon
	@param {Object} [options] Configuration of the weapon
	@param {Object} [projectile] Configuration of the projectiles
	*/
	constructor(name, character, options, projectile){
		options = options || {};
		// call Weapon constructor
		super(name, character, options);

		// definition of the projectile
		projectile = projectile || {};

		// which kind of projectile should be created ?
		var clz = projectile.classUsed,
				opt = projectile.options;
		this.projClass   = typeof clz === "function" ? clz : HERSTAL.Rocket;
		this.projOptions = typeof opt === "object"   ? opt : {};
	}

	/**
	fire a projectile
	@method fire
	*/
	fire(){
		// call default behavior, we don't care about the direction of the shoot
		// but we care about if we have ammo or not
		var direction = super.fire();

		// if we have no more ammo
		if(direction === null){
			return null;
		}

		var proj = new this.projClass(
			this, // this weapon
			this.controllable.Position,    // position of the emmiter of the gun
			this.controllable.Orientation, // orientation of the head of the player
			this.projOptions,           // options for the projectile
		);
	}

}
// we had the class to the Namespace
HERSTAL.Launcher = Launcher;
