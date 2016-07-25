/**
@class Grenade
*/
class Grenade extends HERSTAL.Projectile {
	/**
	@constructor
	@param {Launcher} weapon The weapon who emitted that projectile
	@param {Vec3} position The position of the grenade when created
	@param {Object} orientation The orientation of the grenade when created (x: horizontal angle,y: vertical angle)
	@param {Object} [options] Configuration of the Projectile
	@param {Number} [options.speed] The speed of the grenade at start
	@param {Number} [options.mass] The mass of the grenade
	@param {Number} [options.shape] The shape of the grenade
	@param {Number} [options.shapeRadius] The radius of the sphere or cylinder
	@param {Number} [options.shapeWidth] The width of the box
	@param {Number} [options.shapeHeight] The height of the box or cylinder
	@param {Number} [options.shapeLength] The length of the box
	@param {Number} [options.filterGroup] The filter group of the body
	@param {Number} [options.filterMask]  The filter mask of the body
	*/
	constructor(weapon, position, orientation, options){
		options = options || {};
		// call projectile constructor
		super(weapon, options);

		// default shape is sphere
		var shape  = options.shape || Grenade.SPHERE,
				radius = options.shapeRadius || 0.05,
				width  = options.shapeWidth  || 0.1,
				height = options.shapeHeight || 0.1,
				length = options.shapeLength || 0.1,
				numSeg = options.numSegments || 8;
		// create shape based on given parameters
		switch(shape){
			case Grenade.CYLINDER :
				shape = new CANNON.Cylinder(radius, radius, height, numSeg);
				break;
			case Grenade.BOX :
				shape = new CANNON.Box(
					new CANNON.Vec3(width*0.5, height*0.5, length*0.5)
				);
				break;
			default : // SPHERE
				shape = new CANNON.Sphere(radius);
		}
		// we need a velocity for our projectile
		var speed = options.speed || 20;
		var velocity = UTIL.getForward(orientation).scale(speed);
		// we need the orientation of the projectile as a quaternion
		var quat = new CANNON.Quaternion();
		quat.setFromEuler(orientation.x, orientation.y, 0, 'YXZ');

		// we create the body of our grenade
		this.body = new CANNON.Body({
			position: position,
			quaternion: quat,
			mass: options.mass || 1,
			shape: shape,
			velocity: velocity,
			collisionFilterGroup: options.filterGroup || weapon.filterGroup,
			// grenade shouldn't collide with characters /!\
			collisionFilterMask:  options.filterMask  || HERSTAL.COLLISION.map.group,
		});

		// we add the body to the world
		this.world.addBody(this.body);

		//-- cannot use that because the grenade would collide with it's own character
		// we add an event to detect new collisions
		/*this.body.addEventListener("collide", (event) => {
			// if the grenade touch a character, it explodes
			if(event.contact.body.character != null) this.isDestroyed = true;
		});*/
	}

	/**
	Update the state of the grenade
	@method update
	*/
	update(){
		// get the destination point
		var dest = this.body.position.vadd(this.body.velocity);
		// check collision along the velocity vector
		var ray = new CANNON.Ray(this.body.position, dest);

		// we disable collisions with the character who fired the grenade
		var charBody = this.weapon.character.body;   // we recover the character's body
		var charMask = charBody.collisionFilterMask; // we store the mask of the character
		charBody.collisionFilterMask = 0;            // we disable all collisions

		// we disable collisions with the grenade too
		var grenMask = this.body.collisionFilterMask; // we store the mask of the grenade
		this.body.collisionFilterMask = 0;            // we disable all collisions

		// cast the ray
		var hasHit = ray.intersectWorld(this.world, this._raycastOpt);

		// restore collisions for the character's body and the grenade's body
		charBody.collisionFilterMask  = charMask;
		this.body.collisionFilterMask = grenMask;

		// if we hit something
		if(hasHit){
			var character = ray.result.body.character;
			if(character != null){
				// apply direct hit damage
				character.addDamage(this.damage);
				// and make the grenade explode
				this.isDestroyed = true;
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
		return this.body.position;
	}

	/**
	Return the orientation of the Projectile
	@method get Orientation
	@return {Quaternion} The orientation in space
	*/
	get Orientation(){
		return this.body.quaternion;
	}

	/**
	Destroy the projectile
	@method destroy
	*/
	destroy(){
		// we need to remove the grenade from the world
		this.world.removeBody(this.body);
		// we can then destroy it
		super.destroy();
	}
}
HERSTAL.Grenade = Grenade;

Grenade.CYLINDER = 1;
Grenade.SPHERE   = 2;
Grenade.BOX      = 4;
