/**
Base class for Rocket or Bullet like projectiles
@class Rocket
@extends Projectile
*/
class Rocket extends HERSTAL.Projectile {
	/**
	@constructor
	@param {Launcher} weapon The weapon who emitted that projectile
	@param {Vec3} position The position of the projectile at start
	@param {Object} orientation Orientation of the projectile at start (x: horizontal angle,y: vertical angle)
	@param {Object} [options] Configuration of the projectile
	@param {Boolean} [options.isPercing] Does the rocket pass through characters ?
	@param {Boolean} [options.canReflect] Does the rocket is reflected on walls ?
	@param {Number}  [options.knockBack] Force at which the enemy will be propelled back by the rocket on direct hit
	*/
	constructor(weapon, position, orientation, options){
		options = options || {};
		// call projectile constructor
		super(weapon, options);

		// starting position and orientation of the projectile
		this.position = position;

		// we need the speed of the projectile
		var speed = options.speed || 20;
		this.direction =
			HERSTAL.UTIL.getForwardFromAngles(orientation).scale(speed);

		// special behavior:
		// does the rocket pass through characters ?
		this.isPiercing = options.isPiercing || false;
		// does the rocket bounce on walls ?
		this.canReflect = options.canReflect || false;
	}

	/**
	Update the state of the projectile
	@method update
	*/
	update(){
		// get destination position
		var dest = this.position.vadd(this.direction);
		// check collision forward
		var ray = new CANNON.Ray(this.position, dest);
		var hasHit = ray.intersectWorld(this.world, this._raycastOpt);
		if(hasHit){
			var character = ray.result.body.character;
			if(character != null){
				character.addDamage(this.damage);
				// if piercing shots, the projectile is not
				// destroyed  when passing through characters
				if(!this.isPiercing) this.isDestroyed = true;
			}else{
				// can be reflected by walls
				if(this.canReflect){
					var norm = ray.result.hitNormalWorld;
					// reflect the projectile : r=d−2(d⋅n)n
					this.direction.vsub(
						norm.scale( 2 * this.direction.dot(norm) ),
						this.direction
					);
					// put the projectile at the position of impact
					this.position = ray.result.hitPointWorld;
				}else this.isDestroyed = true;
			}
		}
		// apply default behavior
		super.update();
	}

	/**
	Return the position of the Projectile
	@method get Position
	@return {Vec3} The position in space
	*/
	get Position(){
		return this.position;
	}

	/**
	Return the orientation of the Projectile
	@method get Orientation
	@return {Quaternion} The orientation in space
	*/
	get Orientation(){
		return HERSTAL.UTIL.lookRotation(this.direction);
	}
}
HERSTAL.Rocket = Rocket;
