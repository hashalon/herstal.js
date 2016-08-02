/**
Base class for raycasting weapon
@class Rifle
@extends Weapon
*/
class Rifle extends HERSTAL.Weapon {
	/**
	@constructor
	@param {String} name The name of the rifle
	@param {Character} character The character holding the weapon
	@param {Object} [options] The configuration of the weapon
	@param {Number}  [options.maxDistance] The maximum distance for raycasting
	@param {Boolean} [options.hasSpread] Does the weapon has spread ?
	@param {Array}   [options.fixedSpread] Set define the pattern the spread should follow
	@param {Number}  [options.spreadAmount] How much does the bullet are deviated from their original trajectory
	@param {Number}  [options.numberOfPellets] How much pellets are generated per shots
	@param {Number}  [options.knockback] Force at which the enemy will be propelled back by the shot
	*/
	constructor(name, character, options){
		options = options || {};
		super(name, character, options);

		// distance from the gun barrel to the farest hit possible
		this.distance = options.maxDistance || 10000;

		if(options.hasSpread){
			// did we define a fixed spread pattern ?
			if(options.fixedSpread != null){

				// we create a array to store our angles
				var list = this.fixedSpread = [];

				// for each spread coordinates defined
				for(var i=0; i<options.fixedSpread.length; ++i){
					// coord can either be in X,Y or Theta,Phi (t,p) as specified in ISO
					var coord = options.fixedSpread[i];

					// if object is defined
					if(typeof coord === "object" && coord !== null){

						// if spherical coordinates
						if(typeof coord.t === typeof coord.p === "number"){
							// https://en.wikipedia.org/wiki/Spherical_coordinate_system
							var sint = this.distance * Math.sin(coord.t);
							list[list.length] = { // convert from spherical to carthesian
								x: sint * Math.cos(coord.p),
								y: sint * Math.sin(coord.p),
							};

						// if carthesian coordinates
						}else if(typeof coord.x === typeof coord.y === "number"){
							list[list.length] = coord; // just store the vector
						}
					}
				}
			}else{
				// we must define a really small angle (here 1°)!
				var theta = options.spreadAmount || Math.DEG2RAD*1;
				this.spread    = this.distance * Math.sin(theta); // we don't need phi
				this.nbPellets = options.numberOfPellets || 1; //at least one pellet
			}
		}
		// knockback force on direct hit
		this.knockback = options.knockback || null;

		// we store the configuration for the raycasts
		this._raycastOpt = {
			mode: CANNON.Ray.CLOSEST,
			skipBackfaces: true,
			collisionFilterGroup: options.filterGroup || weapon.filterGroup,
			collisionFilterMask:  options.filterMask  || weapon.filterMask,
		};
	}

	/**
	fire a raycast
	@method fire
	*/
	fire(){
		// we call the default behavior to recover the direction vector for raycast
		var direction = super.fire();
		// if direction is null, the weapon has no more ammo
		if(direction === null){
			return null; // we cannot fire
		}

		// if we defined a knockback force we store it
		var force = typeof this.knockback === "number" ?
			direction.scale(this.knockback) : null;

		// we update the length of the vector direction
		direction.scale(this.distance, direction);

		// we create the two points for our raycast
		var p1 = this.controllable.Position;
		// destination point in space
		var p2 = p1.vadd(direction);

		// to be sure the pellets don't hit the character who fired them
		var body = this.controllable.Body;   // we recover the body
		var mask = body.collisionFilterMask; // we store its default mask
		body.collisionFilterMask = 0;        // we disable all collisions

		// if fixed spread is defined
		if(this.fixedSpread != null){

			// we recover the local 2D coordinate system
			// U is perpendicular to Normal and Up
			// V is perpendicular to Normal and U
			var vecU = direction.cross(CANNON.Vec3.UNIT_Y);
			// in case Normal and Up are colinear, U = X and therefore V = Z
			if(vecU.isZero()) vecU.copy(CANNON.Vec3.UNIT_X);
			var vecV = vecU.cross(direction);
			vecU.normalize();
			vecV.normalize();

			// for each spread angle defined
			for(var i=0; i<this.fixedSpread.length; ++i){
				var coord = this.fixedSpread[i]; // coordinates in 2D

				// we get the destination point in space
				var p3 = p2.vadd(vecU.mult(coord.x).vadd(vecV.mult(coord.y)));
				this._castRay(p1, p3, force);
			}
		}else if(this.spread > 0){
			for(var i=0; i<this.nbPellets; ++i){

				// we add a random vector 3D made within a ball of possible values
				var p3 = p2.vadd({
					x: Math.random2() * this.spread,
					y: Math.random2() * this.spread,
					z: Math.random2() * this.spread,
				});
				this._castRay(p1, p3, force);
			}
		}else{
			// just cast the ray
			this._castRay(p1, p2, force);
		}
		// we restore collisions for the character
		body.collisionFilterMask = mask;
	}

	/**
	Cast a ray between both points and apply effect to objects touched
	@method _castRay @private
	@param {Vec3} p1 Starting point of the ray
	@param {Vec3} p2 Ending point of the ray
	@param {Vec3} force Force to apply incase of knockback
	*/
	_castRay(p1, p2){
		// we create the ray and cast it in the world
		var ray = new CANNON.Ray(p1, p2, force);
		var hasHit = ray.intersectWorld(this.world, this._raycastOpt);

		// if we hit something
		if(hasHit){
			var body = ray.result.body;
			// if knockback is set and the body is dynamic
			if(force !== null && body.type === CANNON.Body.DYNAMIC){
				body.applyImpulse(force, ray.result.hitPointWorld);
			}
			// if the body is the body of a character
			if(this.damage > 0 && body.controllable != null){
				body.controllable.addDamage(this.damage);
			}
		}
	}
}
HERSTAL.Rifle = Rifle;
