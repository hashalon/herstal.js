'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {
	var HERSTALshared = {
		__FPS: 60 // we fix the overall update to 60FPS
	};

	// we use a hack to be able to use the library in both node an the browser
	// if window is not set, we will have an error
	if (!window) window = {};
	// if module is not set, we will have an error
	if (!module) module = {};

	// the library must be usable in both node and browser
	module.exports = window.HERSTALshared = HERSTALshared;

	// Cannon is either already part of the html page or is a module to import
	var CANNON = CANNON || require('./cannon.js');
	if (!CANNON) throw new Error('Herstal.shared needs CANNON.js to work');

	// adds function for CANNON.js objects
	/**
  * Get the angle between this vector and the given vector.
  * @method getAngle
  * @param {Vec3} v Vector to get the angle from
  * @return {number}
  */
	CANNON.Vec3.prototype.getAngle = function (v) {
		// we need two vectors
		var v1 = this.clone();
		var v2 = v ? new CANNON.Vec3(v.x, v.y, v.z) : CANNON.Vec3.UNIT_Y;

		// acos(dot(v1 / norm(v1), v2 / norm(v2)))
		v1.normalize();
		v2.normalize();
		return Math.acos(v1.dot(v2));
	};
	/**
  * Add element only if it's not already present in the list
  */
	Array.prototype.addElement = function (e) {
		var index = this.indexOf(e);
		// if the element is not already in the list
		// we add it to the end of the list
		if (index == -1) {
			this[this.length] = e;
			// we return the position of the element in the array
			return this.length - 1;
		}
		return -1; // the element was already in the array
	};
	/**
  * Remove an element from the list
  */
	Array.prototype.removeElement = function (e) {
		var index = this.indexOf(e);
		// if the element is in the list
		// we can remove it
		if (index > -1) this.splice(index, 1);
		// we return the old position of the element in the array
		return index;
	};

	/**
  * Base class for all characters
  */
	/* CONSTRUCTOR */
	function Character(player, position, orientation, options) {
		options = options || {};

		// the world in which the character exists
		this.world = null;
		this.player = player;
		this.inputs = null;
		// weapons of the character (max should be 10)
		this.weapons = []; // the array needs atleast one weapon
		this.currentWeapon = 0;

		// characterModel used in HERSTALclient
		this.characterModel = null;

		// status of the character
		this.health = options.health || Character.ATTRIBUTES.defaultHealth;
		this.maxHealth = options.maxHealth || Character.ATTRIBUTES.maxHealth;
		this.armor = options.armor || Character.ATTRIBUTES.defaultArmor;
		this.maxArmor = options.maxArmor || Character.ATTRIBUTES.maxArmor;
		this.isDead = false;

		// we recover the potentia custom dimensions of the character
		var dim = this.dimensions = options.dimensions || Character.DIMENSIONS;
		// we correct the dimensions if needed
		dim.head_w = dim.head_w > 0 ? dim.head_w : Character.DIMENSIONS.head_w;
		dim.head_h = dim.head_h > 0 ? dim.head_h : Character.DIMENSIONS.head_h;
		dim.body_w = dim.body_w > 0 ? dim.body_w : Character.DIMENSIONS.body_w;
		dim.body_h = dim.body_h > 0 ? dim.body_h : Character.DIMENSIONS.body_h;
		dim.body_c = dim.body_c > 0 ? dim.body_c : Character.DIMENSIONS.body_c;
		if (!dim.vertices) dim.vertices = Character.DIMENSIONS.vertices;else if (dim.vertices.length < 0) dim.vertices = Character.DIMENSIONS.vertices;

		// position of the new character
		position = position || { x: 0, y: 0, z: 0 };
		// the origin of the character will be placed at neck level
		position.y += dim.body_h;

		// the orientation of the head (not a quaternion)
		this.orientation = orientation || { x: 0, y: 0 };

		// state of the character
		this.isGounded = false;
		this.isCrounched = false;
		// jump timer gives a time interval in which the character can jump
		this.jumpTimer = 0;
		// contains the information about the moving platform the character is standing on
		this.platform = null; // only requiered for moving platforms

		// relative position of the shapes of the character
		var head_pos = { x: 0, z: 0, y: 0.5 * dim.head_h };
		var body_pos = { x: 0, z: 0, y: -0.5 * dim.body_h };
		// shapes of the character
		var head_shape = new CANNON.Box({ x: dim.head_w, y: dim.head_h, z: dim.head_w });
		var body_shape = new CANNON.Box({ x: dim.body_w, y: dim.body_h, z: dim.body_w });

		// we recover the filter based on the team of the player
		var team = options.team || "none";
		var filter = Character.FILTERS[team];
		if (!filter) filter = { group: 7, mask: 7 }; // NO TEAM

		// we create the body collider of the character
		this.body = new CANNON.Body({
			position: position,
			mass: 10,
			material: Character.MATERIAL,
			fixedRotation: true,
			collisionFilterGroup: filter.group,
			collisionFilterMask: filter.mask
		});
		// we add both shapes to the body
		this.body.addShape(body_shape, body_pos); // shape 0 = body
		this.body.addShape(head_shape, head_pos); // shape 1 = head

		// we add more information to the bodies
		this.body.character = this; // a reference to the character
		head_shape.isHead = true; // this shape is the head
	}
	// we add the class to the module
	HERSTALshared.Character = Character;
	Character.prototype.constructor = Character;

	/* SETTER GETTER */
	/**
  * to avoid overflood json files with names, we use short names:
  * o : orientation
  * m : movement
  * i : array of bits :
  ** [0] jump
  ** [1] crounch
  ** [2] fire1
  ** [3] fire2
  ** [4] use
  ** [5] reload
  ** [6] melee
  ** [7] zoom
  * w : weapon slot
  */
	/**
  * store all of the inputs set over JSON
  */
	Character.prototype.setFromInput = function (inputs) {
		if ((typeof inputs === 'undefined' ? 'undefined' : _typeof(inputs)) !== "object") return; // if inputs is empty, there is nothing to do
		this.inputs = {};

		this.inputs.orientation = inputs.o;
		this.inputs.movement = inputs.m;
		this.inputs.jump = !!(inputs.i & 1);
		this.inputs.crounch = !!(inputs.i & 2);
		this.inputs.fire1 = !!(inputs.i & 4);
		this.inputs.fire2 = !!(inputs.i & 8);
		this.inputs.use = !!(inputs.i & 16);
		this.inputs.reload = !!(inputs.i & 32);
		this.inputs.melee = !!(inputs.i & 64);
		this.inputs.zoom = !!(inputs.i & 128);
		this.inputs.weapon = inputs.w;
	};
	/**
  * to avoid overflood json files with names, we use short names:
  * o : orientation
  * p : position
  * v : velocity
  * g : isGrounded
  * c : isCrounched
  */
	/**
  * set all of the position and movement of the character from the data object
  */
	Character.prototype.setFromData = function (data) {
		if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== "object") return; // if data is empty, there is nothing to do
		// we update the orientation of the character
		this.setLook(data.o);

		// if the position is set
		if (_typeof(data.p) === "object") {
			// if position is a vector 3
			if (_typeof(data.p.x) === _typeof(data.p.y) === _typeof(data.p.z) === "number") {
				this.body.position.copy(data.p);
			}
		}
		// if the velocity is set
		if (_typeof(data.v) === "object") {
			// if velocity is a vector 3
			if (_typeof(data.v.x) === _typeof(data.v.y) === _typeof(data.v.z) === "number") {
				this.body.velocity.copy(data.v);
			}
		}
		// if grounded and crounched are set
		if (data.g !== null) this.isGrounded = data.g;
		if (data.c !== null) this.isCrounched = data.c;
	};
	/**
  * read all of the position and movement of the character and create a object out of them
  */
	Character.prototype.getData = function () {
		return {
			o: this.orientation,
			p: {
				x: this.body.position.x,
				y: this.body.position.y,
				z: this.body.position.z
			},
			v: {
				x: this.body.velocity.x,
				y: this.body.velocity.y,
				z: this.body.velocity.z
			},
			g: this.isGrounded,
			c: this.isCrounched
		};
	};

	/* UPDATE FUNCTIONS */
	/**
  * Global update function of the character
  */
	Character.prototype.updateAll = function () {
		var inputs = this.inputs || {};

		// where the character is looking at ?
		this.setLook(inputs.orientation);
		// is the character on the ground ?
		this.updateGround();
		// in which direction the character is moving, is he jumping ?
		this.updateMove(inputs.movement, inputs.jump);
		// is the character crounching ?
		this.updateCrounch(inputs.crounch);
		// if the character is on a platform, we should record it's position
		this.updatePlatform();
		// we update the weapon the character is holding
		this.setWeapon(inputs.weapon);
	};
	/**
  * Allow the character to look around
  * calculation based on mouse delta is performed client side
  */
	Character.prototype.setLook = function (orientation) {
		// if orientation is set
		if (orientation) {
			var PI2 = Math.PI * 2,
			    hPI = Math.PI * 0.5;
			// we keep angle in the [ -2PI, 2PI ] interval
			orientation.x %= PI2;
			orientation.y %= PI2;
			// we cap the angle on the Y-axis within [ -PI/2, PI/2 ] interval
			if (orientation.y > hPI) orientation.y = hPI;else if (orientation.y < -hPI) orientation.y = -hPI;
			// we apply the orientation
			this.orientation = orientation;
		}
	};
	/**
  * Allow to add more rotation to the character on the Y-axis
  */
	Character.prototype.addRotation = function (angle) {
		// we add the angle on the Y-axis
		this.orientation.x += angle;
		this.orientation.x %= Math.PI * 2;
	};
	/**
  * Allow the character to move around
  * Movement calculation is performed both client and server side
  * server has the authority over the client
  */
	Character.prototype.updateMove = function (axis, jump) {
		// if axis is not set, we set it to vector null
		axis = axis || { x: 0, y: 0 };

		// we normalize the vector to avoid cheating
		var sqrLength = axis.x * axis.x + axis.y * axis.y;
		if (sqrLength > 1) {
			var length = Math.sqrt(sqrLength);
			axis.x /= length;
			axis.y /= length;
		}

		// we need the angle on the x axis (horizontal plane)
		var theta = this.orientation.x;
		var speed = this.isCrounched ? Character.ATTRIBUTES.crounchedSpeed : Character.ATTRIBUTES.moveSpeed;

		// we create a new velocity vector
		var velocity = {
			y: this.body.velocity.y,
			x: (axis.x * Math.cos(theta) - axis.y * Math.sin(theta)) * speed,
			z: (-axis.x * Math.sin(theta) - axis.y * Math.cos(theta)) * speed
		};

		// if the player pressed the jump input
		if (jump) this.jumpTimer = Character.ATTRIBUTES.jumpTimer;

		// if the jump timer is set, we decreament it
		if (this.jumpTimer > 0) --this.jumpTimer;

		// if the character is on the ground
		if (this.isGrounded) {
			// if the character wants to jump
			if (this.jumpTimer > 0) {
				// we reset the timer, the character jumps once
				this.jumpTimer = 0;
				// we apply a vertical velocity
				velocity.y = Character.ATTRIBUTES.jumpForce;
			}
		} else {
			// in the air, the new velocity is influenced by the old one
			// new_vel = new_vel/2 + old_vel/2;
			velocity.x += this.body.velocity.x;
			velocity.z += this.body.velocity.z;
			velocity.x *= 0.5;
			velocity.z *= 0.5;
		}
		this.body.velocity = velocity;
	};
	/**
  * Function to know if the character is on the ground or not
  */
	Character.prototype.updateGround = function () {
		// we reset the state of the character
		this.isGrounded = false;
		// we try each vertices we have defined for characters
		for (var i = 0; i < this.dimensions.vertices.length; ++i) {

			// for each vertice, we move it from local to global coords
			var vert = this.body.vadd(this.dimensions.vertices[i]);
			// we put the vertice at the base of the body shape
			vert.y -= this.body.shapes[0].halfExtents.y * 2; // shape 0 is body

			// we recover the result of the contact with the ground
			var result = Character.checkCollision(this.body.world, vert, -0.1);
			if (result.hasHit) {

				// the angle between the surface normal and the vector up
				var angle = result.hitNormalWorld.getAngle(CANNON.Vec3.UNIT_Y);
				// if the ground on which the character stand is not too steep
				if (angle < Character.ATTRIBUTES.steepSlope) {

					// we are on a ground
					this.isGrounded = true;
					// if the platform on which we land is kinematic
					if (result.body.type === CANNON.Body.KINEMATIC) {

						// did we changed of platform ?
						var hasChanged = false;
						if (!platform) hasChanged = true;else if (platform.body !== result.body) hasChanged = true;
						// if the platform has changed, we need to update the platform
						if (hasChanged) {
							this.platform = { body: result.body };
							this.updatePlatform();
						}
					} else {
						// we landed on a platform which is not kinematic
						this.platform = null;
					}
					// we've found one contact point
					return; // we don't need to check the others
				}
			}
		}
		this.platform = null;
	};
	/**
  * Update the position of the character based on the position of the platform he is standing on
  * /!\ Should be called after physic engine calculations /!\
  */
	Character.prototype.updatePlatformPosition = function () {
		var p = this.platform;
		if (p) {
			// if the character is standing on a platform

			// we calculate the movement of the platform since the last update
			var newGlobalPos = p.pointToWorldFrame(p.localPos);
			var translation = newGlobalPos.vsub(p.globalPos);
			// we apply the movement to the player
			this.body.position = this.body.position.vadd(translation);

			// we calculate the rotation of the platform since the last update
			var newGlobalRot = p.body.quaternion.mult(p.localRot);
			var rotationDiff = newGlobalRot.mult(p.globalRot.inverse());
			// the character body cannot rotate because fixedRotation=true
			var vec = {};
			rotationDiff.toEuler(vec);
			// we add the rotation to the horizontal plane
			this.addRotation(vec.y);
		}
	};
	/**
  * update the local position and orientation of the character
  * relative to the platform
  */
	Character.prototype.updatePlatform = function () {
		if (this.platform) {
			// if the platform is not null
			// position of the platform
			this.platform.globalPos = this.body.position.clone();
			this.platform.localPos = this.platform.body.pointToLocalFrame(this.platform.globalPos);
			// orientation of the platform
			this.platform.globalRot = this.body.quaternion.clone();
			this.platform.localRot = this.platform.body.quaternion.inverse().mult(this.platform.globalRot);
		}
	};
	/**
  * Function to manage character height and crounching
  */
	Character.prototype.updateCrounch = function (crounch) {
		var canGetUp = true;
		if (crounch) {
			canGetUp = false;
			this.isCrounched = true;
		} else if (this.isCrounched) {
			// we try each vertices we have defined for characters
			// as long as canGetUp is not false
			for (var i = 0; i < this.dimensions.vertices.length && canGetUp; ++i) {

				// for each vertice, we move it from local to global coords
				var vert = this.body.vadd(this.dimensions.vertices[i]);
				// we put the vertice at the top of the head shape
				vert.y += this.dimensions.head_h;

				// we recover the result of the contact with the ground
				var result = Character.checkCollision(this.body.world, vert, 0.1);
				if (result.hasHit) canGetUp = false;
			}
		}

		// we recover the shape and the offset
		var shape = this.body.shapes[0];
		var offset = this.body.shapeOffsets[0];
		var inc = Character.ATTRIBUTES.crounchIncrement;
		var h;
		// if the character can stand up
		if (canGetUp) {
			// as long as we are not fully standing up
			if (shape.halfExtents.y * 2 < this.dimensions.body_h) {
				// we increase the size of the shape
				shape.halfExtents.y += inc * 2;
				// we bring the shape closer to the the origin
				offset.y -= inc;

				// if we have a shape bigger than expected
				if (shape.halfExtents.y * 2 >= this.dimensions.body_h) {
					h = this.dimensions.body_height * 0.5;
					// we cap the values
					shape.halfExtents.y = h;
					offset.y = -h;
					// the character is no longer crounched
					this.isCrounched = false;
				}
			}
		} else {
			// cannot stand up
			// as long as we are not fully crounched
			if (shape.halfExtents.y * 2 > this.dimensions.body_c) {
				// we decrease the size of the shape
				shape.halfExtents.y -= inc * 2;
				// we put the shape farther from the origin
				offset.y += inc;

				// if we have a shape smaller than expected
				if (shape.halfExtents.y * 2 < this.dimensions.body_c) {
					h = this.dimensions.body_c * 0.5;
					// we cap the values
					shape.halfExtents.y = h;
					offset.y = -h;
				}
			}
		}
	};

	Character.prototype.setWeapon = function (index) {
		// if the weapons array is empty or we haven't specified a weapon to switch to
		if (this.weapons.length === 0 && index === null) return; //there is nothing to do
		// what will be the new weapon of the player ?
		var newWeap = this.currentWeapon;
		// if index is positive
		if (-1 < index && index < this.weapons.length) {
			// if a weapon exists at the index position
			if (this.weapons[index] !== null) {
				// we set the weapon
				newWeap = index;
			}
		} else {
			// if index==-1 : previous weapon, if index==-2 : next weapon
			var incre = index == -1 ? -1 : +1;
			// we loop weapons.length times at max to avoid endless loop
			for (var i = 0, stop = false; i < this.weapons.length || stop; ++i) {
				// we increament or decreament the value
				newWeap += incre;
				// we cap the value
				if (newWeap >= this.weapons.length) newWeap = 0;else if (newWeap < 0) newWeap = this.weapons.length - 1;
				// if we found a weapon which is not null, we stop the loop
				if (this.weapons[newWeap] !== null) stop = true;
			}
		}

		// we call the necessary functions to update the display in HERSTALclient

		// we can store the new weapon as the current weapon now
		this.currentWeapon = newWeap;
	};

	Character.prototype.getDamage = function (damage) {
		// if the character as some armor
		if (this.armor > 0) {
			var armorDamage = damage * Character.ATTRIBUTES.armorProtection;
			damage -= armorDamage; // we reduce the overall damage
			this.armor -= armorDamage; // we apply damage to the armor
			// if there was more damage than expected
			if (this.armor < 0) {
				// we apply the difference
				damage -= this.armor;
				this.armor = 0;
			}
		}
		this.health -= damage;
		// if health reach 0, the character is dead
		if (this.health <= 0) this.isDead = true;
	};

	Character.prototype.getHealth = function (health) {
		this.health += health;
		// if health is higher than max, we cap the value
		if (this.health > this.maxHealth) this.health = this.maxHealth;
	};

	Character.prototype.getArmor = function (armor) {
		this.armor += armor;
		// if health is higher than max, we cap the value
		if (this.armor > this.maxArmor) this.armor = this.maxArmor;
	};

	Character.prototype.killed = function (callback) {

		callback();
	};

	/* STATIC ATTRIBUTES */
	var fw = 0.8,
	    fh = 1.8,
	    fc = 1.0;
	var hw = 0.6,
	    hh = 0.4; // head dimensions
	var bw = fw,
	    bh = fh - hh,
	    bc = fc - hh; // body dim = full dim - head dim

	// character dimensions
	Character.DIMENSIONS = {
		head_w: hw,
		head_h: hh,
		body_w: bw,
		body_h: bh,
		body_c: bc,
		// vertices used for ground and ceiling detection
		vertices: [{ x: 0, z: 0 }, { x: bw, z: bw }, { x: bw, z: -bw }, { x: -bw, z: bw }, { x: -bw, z: -bw }]
	};

	Character.checkCollision = function (world, vertice) {
		var padding = arguments.length <= 2 || arguments[2] === undefined ? 0.1 : arguments[2];

		// we create the starting and ending points of the rays
		var from = new CANNON.Vec3(vertice.x, vertice.y, vertice.z);
		var to = from.vadd({ y: padding });
		var ray = new CANNON.Ray(from, to);

		// we check collision with the world
		ray.intersectWorld(world, {
			mode: Ray.CLOSEST,
			skipBackfaces: true,
			collisionFilterGroup: 1,
			collisionFilterMask: 1
		});
		// we return the results rather than just hasHit
		return ray.result;
	};

	// attributes of the character
	Character.ATTRIBUTES = {
		defaultHealth: 100, // health of the character on spawn
		maxHealth: 100, // maximum health for the character
		defaultArmor: 0, // armor of the character on spawn
		maxArmor: 100, // maximum armor for the character
		armorProtection: 2 / 3, // number of hit taken by the armor
		moveSpeed: 20, // movement speed standing up
		crounchedSpeed: 10, // movement speed crounched
		jumpForce: 30, // jump force
		jumpTimer: 10, // time before registering jumps
		crounchIncrement: 0.05, // time between standing and crounching
		steepSlope: 50 };

	/* bit definition:
 	4 : TEAM BETA
 	3 : TEAM ALPHA
 	2 : NO TEAM
 	1 : CHARACTER
 	0 : WORLD
 */
	// Team definition
	// maximum angle for walking on slopes
	Character.FILTERS = {
		none: { group: 7, mask: 7 }, // NO TEAM
		alpha: { group: 11, mask: 11 }, // TEAM ALPHA
		beta: { group: 19, mask: 19 } };

	/**
  * Player informations for both server and client
  * name of the player and its colors: primary, secondary and laser
  */

	// TEAM BETA
	function Player(id, name, colors, model) {
		this.id = id;
		this.name = name;
		this.colors = colors;
		this.team = "none";
		this.model = model;

		this.character = null;
	}
	// we add the class to the module
	HERSTALshared.Player = Player;
	Player.prototype.constructor = Player;

	Player.prototype.createCharacter = function (position, orientation) {
		this.character = new Character(this, position, orientation, { team: this.team });
	};

	function World() {

		this.step = 1 / HERSTALshared.__FPS;

		this.cannonWorld = new CANNON.World();
		this.cannonWorld.gravity.set(0, -100, 0);
		this.cannonWorld.defaultContactMaterial.friction = 0.1;

		// worldRender used in HERSTALclient
		this.worldRender = null;

		// we create a new material for the characters
		this.characterMaterial = new CANNON.Material("character");
		this.cannonWorld.addContactMaterial(new CANNON.ContactMaterial(Character.MATERIAL, WORLD.defaultMaterial, {
			friction: 0,
			restitution: 0,
			contactEquationStiffness: 1e8,
			contactEquationRelaxation: 3
		}));

		this.characters = [];
	}
	HERSTALshared.World = World;
	World.prototype.constructor = World;

	/**
  * The function that must be executed 60 times per seconds
  */
	World.prototype.update = function () {
		var i;
		// we update the overall movement of the characters
		for (i = 0; i < this.characters.length; ++i) {
			this.characters[i].updateAll();
		}
		// we update the world physics
		world.step(this.step);
		// we update the position of the characters based on the platform he's standing on
		for (i = 0; i < this.characters.length; ++i) {
			this.characters[i].updatePlatformPosition();
		}
	};

	World.prototype.addCharacter = function (character) {
		// we keep track of it in a list
		this.characters.addElement(character);
		// the character is part of this world
		character.world = this;
		// we add its body to the cannonWorld
		this.cannonWorld.addBody(character.body);

		// if HERSTALclient is defined
		if (this.worldRender && character.characterModel) {
			this.worldRender.addCharacterModel(character.characterModel);
		}
	};

	World.prototype.removeCharacter = function (character) {
		var index = this.characters.removeElement(character);
		// if the character was in the array
		if (index > -1) {
			character.world = null;
			this.cannonWorld.removeBody(character.body);

			// if HERSTALclient is defined
			if (this.worldRender && character.characterModel) {
				this.worldRender.removeCharacter(character.characterModel);
			}
		}
	};

	World.FILTER = { group: 7, mask: 7 };
})();