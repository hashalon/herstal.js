(function(undefined) {

// parameters for the app
var options = options || {};

// we need modules some other modules
var module, window;
// we use a hack to be able to use the library in both node an the browser
// if window is not set, we will have an error
if(!window) window = {};
// if module is not set, we will have an error
if(!module) module = {
	// we link exports to the window variable
	get exports() {
		return window.HERSTAL;
	},
	set exports(exports)  {
		window.HERSTAL = exports;
	}
};

var CANNON = require('../../lib/cannon.min.js');
if(!CANNON) throw new Error('Herstal.shared needs CANNON.js to work');

var WORLD = new CANNON.World();
WORLD.gravity.set(0, -100, 0);
WORLD.defaultContactMaterial.friction = 0.1;


/**
 * Base class for all characters
 */
/* CONSTRUCTOR */
function Character(player, position, orientation, options){
	options = options || {};

	// shortcut for constants
	var hw = Character.DIMENSIONS.head.width ,
	    hh = Character.DIMENSIONS.head.height,
	    bw = Character.DIMENSIONS.body.width ,
	    bh = Character.DIMENSIONS.body.height;

	// position of the new character
	position = position || { x: 0, y: 0, z: 0 };
	// the origin of the character will be placed at neck level
	position.y += bh;

	// the orientation of the head (not a quaternion)
	this.orientation = orientation || { x: 0, y: 0 };

	// state of the character
	this.isGounded   = false;
	this.isCrounched = false;
	// jump timer gives a time interval in which the character can jump
	this.jumpTimer = 0;
	// contains the information about the moving platform the character is standing on
	this.platform = null; // only requiered for moving platforms

	// relative position of the shapes of the character
	var head_pos = { x: 0, z: 0, y:  0.5 * hh };
	var body_pos = { x: 0, z: 0, y: -0.5 * bh };
	// shapes of the character
	var head_shape = new CANNON.Box({ x: hw, y: hh, z: hw });
	var body_shape = new CANNON.Box({ x: bw, y: bh, z: bw });

	// we recover the filter based on the team of the player
	var team = options.team || "none";
	var filter = Character.FILTERS[team];
	if(!filter) filter = {group : 0b111, mask : 0b111}; // NO TEAM

	// we create the body collider of the character
	this.body = new CANNON.Body({
		position : position,
		mass : 10,
		material : Character.MATERIAL,
		fixedRotation : true,
		collisionFilterGroup : filter.group,
		collisionFilterMask  : filter.mask,
	});
	// we add both shapes to the body
	this.body.addShape(body_shape, body_pos); // shape 0 = body
	this.body.addShape(head_shape, head_pos); // shape 1 = head

	// we add more information to the bodies
	this.body.character = this; // a reference to the character
	head_shape.isHead   = true; // this shape is the head

	// we add the body to the world
	WORLD.addBody(this.body);
}
Character.prototype.constructor = Character;

/* STATIC ATTRIBUTES */
var fw = 0.8, fh = 1.8, fc = 1.0;
var hw = 0.6, hh = 0.4;               // head dimensions
var bw = fw , bh = fh-hh, bc = fc-hh; // body dim = full dim - head dim

// character dimensions
Character.DIMENSIONS = {
	head: {
		width:  hw,
		height: hh
	},
	body: {
		width:     bw,
		height:    bh,
		crounched: bc
	},
	// vertices used for ground and ceiling detection
	vertices: [
		{ x:   0, z:   0 },
		{ x:  bw, z:  bw },
		{ x:  bw, z: -bw },
		{ x: -bw, z:  bw },
		{ x: -bw, z: -bw }
	],
	checkCollision: function( world, vertice, padding = 0.1 ){
		// we create the starting and ending points of the rays
		var from = new CANNON.Vec3( vertice.x, vertice.y, vertice.z );
		var to   = from.vadd({y: padding});
		var ray  = new CANNON.Ray( from, to );

		// we check collision with the world
		ray.intersectWorld(world, {
			mode: Ray.CLOSEST,
			skipBackfaces: true,
			collisionFilterGroup: 0b1,
			collisionFilterMask:  0b1
		});
		// we return the results rather than just hasHit
		return ray.result;
	}
};

var speed = 20, jump = 30, crounch = 0.05;

// attributes of the character
Character.ATTRIBUTES = {
	moveSpeed:        speed,     // movement speed standing up
	crounchedSpeed:   speed*0.5, // movement speed crounched
	jumpForce:        jump,      // jump force
	jumpTimer:        10,        // time before registering jumps
	crounchIncrement: crounch,   // time between standing and crounching
	steepSlope:       50,        // maximum angle for walking on slopes
};

Character.MATERIAL = new CANNON.Material("character");
WORLD.addContactMaterial(new CANNON.ContactMaterial(Character.MATERIAL, WORLD.defaultMaterial, {
	friction:    0,
	restitution: 0,
	contactEquationStiffness:  1e8,
	contactEquationRelaxation:   3
}));

/* bit definition:
	4 : TEAM BETA
	3 : TEAM ALPHA
	2 : NO TEAM
	1 : CHARACTER
	0 : WORLD
*/
// Team definition
Character.FILTERS = {
	none  : { group: 0b00111, mask: 0b00111 }, // NO TEAM
	alpha : { group: 0b01011, mask: 0b01011 }, // TEAM ALPHA
	beta  : { group: 0b10011, mask: 0b10011 }, // TEAM BETA
};

/* UPDATE FUNCTIONS */

/**
 * Allow the character to look around
 * calculation based on mouse delta is performed client side
 */
Character.prototype.updateLook = function( orientation ){
	// if orientation is set
	if(orientation){
		var PI2 = Math.PI*2, hPI = Math.PI*0.5;
		// we keep angle in the [ -2PI, 2PI ] interval
		orientation.x %= PI2;
		orientation.y %= PI2;
		// we cap the angle on the Y-axis within [ -PI/2, PI/2 ] interval
		     if(orientation.y >  hPI) orientation.y =  hPI;
		else if(orientation.y < -hPI) orientation.y = -hPI;
		// we apply the orientation
		this.orientation = orientation;
	}
};
/**
 * Allow to add more rotation to the character on the Y-axis
 */
Character.prototype.addRotation = function( angle ){
	// we add the angle on the Y-axis
	this.orientation.x += angle;
	this.orientation.x %= Math.PI*2;
};
/**
 * Allow the character to move around
 * Movement calculation is performed both client and server side
 * server has the authority over the client
 */
Character.prototype.updateMove = function( axis, jump ){
	// if axis is not set, we set it to vector null
	axis = axis || {x: 0, y: 0};

	// we normalize the vector to avoid cheating
	var sqrLength = axis.x*axis.x + axis.y*axis.y;
	if( sqrLength > 1 ){
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
		x: (  axis.x*Math.cos(theta) -axis.y*Math.sin(theta) ) * speed,
		z: ( -axis.x*Math.sin(theta) -axis.y*Math.cos(theta) ) * speed
	};

	// if the player pressed the jump input
	if(jump) this.jumpTimer = Character.ATTRIBUTES.jumpTimer;

	// if the jump timer is set, we decreament it
	if( this.jumpTimer > 0 ) --this.jumpTimer;

	// if the character is on the ground
	if( this.isGrounded ){
		// if the character wants to jump
		if( this.jumpTimer > 0 ){
			// we reset the timer, the character jumps once
			this.jumpTimer = 0;
			// we apply a vertical velocity
			velocity.y = Character.ATTRIBUTES.jumpForce;
		}
	}else{
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
Character.prototype.updateGround = function(){
	// we reset the state of the character
	this.isGrounded = false;
	// we try each vertices we have defined for characters
	for( var i=0; i<Character.DIMENSIONS.vertices.length; ++i ){

		// for each vertice, we move it from local to global coords
		var vert = this.body.vadd( Character.DIMENSIONS.vertices[i] );
		// we put the vertice at the base of the body shape
		vert.y -= this.body.shapes[0].halfExtents.y * 2; // shape 0 is body

		// we recover the result of the contact with the ground
		var result = Character.DIMENSIONS.checkCollision(this.body.world, vert, -0.1);
		if(result.hasHit){

			// the angle between the surface normal and the vector up
			var angle = result.hitNormalWorld.getAngle(CANNON.Vec3.UNIT_Y);
			// if the ground on which the character stand is not too steep
			if( angle < Character.ATTRIBUTES.steepSlope ){

				// we are on a ground
				this.isGrounded = true;
				// if the platform on which we land is kinematic
				if( result.body.type === CANNON.Body.KINEMATIC ){

					// did we changed of platform ?
					var hasChanged = false;
					if(!platform) hasChanged = true;
					else if(platform.body !== result.body) hasChanged = true;
					// if the platform has changed, we need to update the platform
					if(hasChanged){
						this.platform = { body: result.body };
						this.updatePlatform();
					}
				}else{
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
 */
Character.prototype.updatePosition = function(){
	var p = this.platform;
	if(p){ // if the character is standing on a platform

		// we calculate the movement of the platform since the last update
		var newGlobalPos = p.pointToWorldFrame(p.localPos);
		var translation  = newGlobalPos.vsub(p.globalPos);
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
Character.prototype.updatePlatform = function(){
	var p = this.platform;
	if(p){ // if the platform is not null
		// position of the platform
		p.globalPos = this.body.position.clone();
		p.localPos  = p.body.pointToLocalFrame(p.globalPos);
		// orientation of the platform
		p.globalRot = this.body.quaternion.clone();
		p.localRot  = p.body.quaternion.inverse().mult(p.globalRot);
	}
};
/**
 * Function to manage character height and crounching
 */
Character.prototype.updateCrounch = function(crounch){
	var dim = Character.DIMENSIONS;

	var canGetUp = true;
	if(crounch){
		canGetUp = false;
		this.isCrounched = true;
	}else if(this.isCrounched){
		// we try each vertices we have defined for characters
		// as long as canGetUp is not false
		for( var i=0; i<dim.vertices.length && canGetUp; ++i ){

			// for each vertice, we move it from local to global coords
			var vert = this.body.vadd( dim.vertices[i] );
			// we put the vertice at the top of the head shape
			vert.y += dim.head.height;

			// we recover the result of the contact with the ground
			var result = dim.checkCollision(this.body.world, vert, 0.1);
			if(result.hasHit) canGetUp = false;
		}
	}

	// we recover the shape and the offset
	var shape  = this.body.shapes[0];
	var offset = this.body.shapeOffsets[0];
	var inc = character.ATTRIBUTES.crounchIncrement;
	var h;
	// if the character can stand up
	if(canGetUp){
		// as long as we are not fully standing up
		if( shape.halfExtents.y*2 < dim.body.height ){
			// we increase the size of the shape
			shape.halfExtents.y += inc*2;
			// we bring the shape closer to the the origin
			offset.y -= inc;

			// if we have a shape bigger than expected
			if( shape.halfExtents.y*2 > dim.body.height ){
				h = dim.body.height * 0.5;
				// we cap the values
				shape.halfExtents.y = h;
				offset.y = -h;
			}
		}
	}else{ // cannot stand up
		// as long as we are not fully crounched
		if( shape.halfExtents.y*2 > dim.body.crounched ){
			// we decrease the size of the shape
			shape.halfExtents.y -= inc*2;
			// we put the shape farther from the origin
			offset.y += inc;

			// if we have a shape smaller than expected
			if( shape.halfExtents.y*2 < dim.body.crounched ){
				h = dim.body.crounched * 0.5;
				// we cap the values
				shape.halfExtents.y = h;
				offset.y = -h;
			}
		}
	}
};


/**
 * Player informations for both server and client
 * name of the player and its colors: primary, secondary and laser
 */

 function Player(id, name, colors){
	 this.id = id;
     this.name = name;
     this.colors = colors;
     this.team = "none";
 }
 Player.prototype.constructor = Player;

Player.prototype.createCharacter = function(position, orientation){
    this.character = new Character(this, position, orientation, {team: this.team});
};


// adds function for CANNON.js objects
/**
 * Get the angle between this vector and the given vector.
 * @method getAngle
 * @param {Vec3} v Vector to get the angle from
 * @return {number}
 */
CANNON.Vec3.prototype.getAngle = function(v){
	// we need two vectors
	var v1 = this.clone();
	var v2 = v ? new CANNON.Vec3(v.x, v.y, v.z) : CANNON.Vec3.UNIT_Y;

	// acos(dot(v1 / norm(v1), v2 / norm(v2)))
	v1.normalize();
	v2.normalize();
	return Math.acos( v1.dot(v2) );
};

module.exports = { WORLD: WORLD, Player: Player, Character: Character };
})();