/**
@class Projectile
*/
class Projectile {
	/**
	@constructor
	@param {String} name The name of the weapon
	@param {Launcher} weapon The weapon who emitted that projectile
	@param {Object} options Configuration of the projectile
	*/
	constructor(name, weapon, options){
		options = options || {};

		// id of the projectile for online identification
		this.id = null;
		// the world in which the projectile move
		this.world = weapon.world;

		// name of the projectile and the weapon which emitted it
		this.name   = name;
		this.weapon = weapon;
		// direct damage hit and life time of the projectile
		this.damage = options.directDamage ||  50;
		this.life   = options.lifeTime     || 120; //2 seconds
		// does the projectile explode on impact ?
		if(options.explode){
			var rad = options.explosionRadius || 10;
			this.sqrRadius  = rad*rad; // squared
			this.explForce  = options.explosionForce ;
			this.explDamage = options.explosionDamage;
		}
		this.isDestroyed = false;

		// options applied for each raycast
		this._raycastOpt = {
			mode: CANNON.Ray.CLOSEST,
			skipBackfaces: true,
			collisionFilterGroup: options.filterGroup || weapon.filterGroup,
			collisionFilterMask:  options.filterMask  || weapon.filterMask,
		};
	}

	/**
	Update the state of the projectile
	@method update
	*/
	update(){
		// when life counter is over, we can destroy the projectile
		--this.life;
		if(this.life < 0) this.isDestroyed = true;
		if(this.isDestroyed) this.destroy();
	}

	/**
	Return  the position of the Projectile
	@private To implement in extending classes
	@method get Position
	@return {Vec3} The position in space
	*/
	get Position(){
		return new CANNON.Vec3();
	}

  /**
	Return the orientation of the Projectile
	@private To implement in extending classes
	@method get Orientation
	@return {Quaternion} The orientation in space
	*/
	get Orientation(){
		return new CANNON.Quaternion();
	}

	/**
	Destroy the projectile
	@method destroy
	*/
	destroy(){
		// if explosion radius is set
		if(this.sqrRadius > 0){
			// for each physical objects
			var bodies = this.world.cannonWorld.bodies;
			for(var i=0; i<bodies.length; ++i){
				// if it's body is dynamic
				var body = bodies[i];
				if(body.type === CANNON.Body.DYNAMIC){
					var p1 = this.Position,
						  p2 = body.position;
					// if the body is within blast radius
					var direction = p1.vsub(p2);
					var sqrDistance  = direction.sqrLength();
					if(sqrDistance < this.sqrRadius){
						// we check if the body is not behind a wall
						var ray = new CANNON.Ray(p1, p2);
						ray.intersectWorld(this.world, this._raycastOpt);
						// if the body is exposed to the explosion
						if(body === ray.result.body){
							// if we specified a repulsion force
							if(this.explForce > 0){
								// we normalize direction and scale it up
								direction.normalize();
								direction.mult(this.explForce, direction);
								body.applyImpulse(direction, p1);
							}
							// if we specified damages
							if(this.explDamage > 0 && body.character != null){
								// full damage at explosion point
								// less damage at perifery
								var dmg = Math.sqrt(
									this.sqrRadius - sqrDistance/this.sqrRadius
								);
								body.character.addDamage(dmg);
							}
						}
					}
				}
			}
		}
		// TODO remove projectile from world
	}
}
HERSTAL.Projectile = Projectile;
