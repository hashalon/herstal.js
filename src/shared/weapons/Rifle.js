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
	@param {Number}  [options.knockBack] Force at which the enemy will be propelled back by the shot
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
				// we recover the inverse of our ray length
				var invDistance = 1/this.distance;

				// for each spread coordinates defined
				for(var i=0; i<options.fixedSpread.length; ++i){
					// coord can either be in X,Y or Theta,Phi (t,p) as specified in ISO
					var coord = options.fixedSpread[i];

					// if object is defined
					if(typeof coord === "object" && coord !== null){

						// if spherical coordinates
						if(typeof coord.t === typeof coord.p === "number"){
							list[list.length] = coord; // just store it

						// if carthesian coordinates
						}else if(typeof coord.x === typeof coord.y === "number"){
							list[list.length] = { // we need to convert it
								t: Math.acos(invDistance),
								p: Math.atan2(coord.y, coord.x),
							};
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
	@return raycast result
	*/
	fire(){
		// we create the two points for our raycast
		var p1 = this.character.body.position;

		// if fixed spread is defined
		if(this.fixedSpread != null){

			// for each spread angle defined
			for(var i=0; i<this.fixedSpread.length; ++i){
				var coord = this.fixedSpread[i];

				// we get the destination point in space
				var p2 = p1.vadd({
					x: this.distance * Math.sin(coord.t) * Math.cos(coord.p),
					y: this.distance * Math.sin(coord.t) * Math.sin(coord.p),
					z: this.distance * Math.cos(coord.t),
				});
				this._castRay(p1, p2);
			}
		}else{
			// direction vector for the raycast
			var direction = HERSTAL.UTIL.getForwardFromAngles(
				this.character.orientation).scale(this.distance);
			// destination point in space
			var p2 = p1.vadd(direction);

			if(this.spread > 0){
				for(var i=0; i<this.nbPellets; ++i){

					// we add a random vector 3D made within a ball of possible values
					var p3 = p2.vadd({
						x: Math.random2() * this.spread,
						y: Math.random2() * this.spread,
						z: Math.random2() * this.spread,
					});
					this._castRay(p1, p3);
				}
			}else{
				// just cast the ray
				this._castRay(p1, p2);
			}
		}

	}

	/**
	Cast a ray between both points and apply effect to objects touched
	@method _castRay @private
	@param {Vec3} p1 Starting point of the ray
	@param {Vec3} p2 Ending point of the ray
	*/
	_castRay(p1, p2){
		// we create the ray and cast it in the world
		var ray = new CANNON.Ray(p1, p2);
		var hasHit = ray.intersectWorld(this.world, this._raycastOpt);

		// if we hit something
		if(hasHit){
			var body = ray.result.body;
			if(body != null){

				// if the body is the body of a character
				if(this.damage > 0 && body.character != null){
					body.character.addDamage(this.damage);
				}
			}
		}
	}
}
HERSTAL.Rifle = Rifle;
