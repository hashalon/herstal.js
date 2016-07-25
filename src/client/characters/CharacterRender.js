/**
Class to manage characters appearance and animations
@class CharacterRender
*/
class CharacterRender {
	constructor(id, player, position, orientation, options){
		options = options || {};

		this.id = id;
		this.player = player;

		// the worldRender of the model
		this.worldRender = null;

		this.geometry = null;
		this.material = null;
		this.mesh = new THREE.Mesh(this.geometry, this.material);

		// we set the orientation of the character
		this.setlook(orientation);
	}

	/**
	Set all of the position and movement of the character from the data object
	@method setFromData
	@param {Object} [data]   Data setting the state of the character
	@param {Vec2}   [data.orient] Orientation of the character
	@param {Vec3}   [data.pos] Position of the character
	@param {Vec3}   [data.vel] Velocity of the character
	@param {Number} [data.state] Array of bits:
		[0] is grounded
		[1] is crounched
		[2] is jumping
		[3] is firing
		[4] is reloading
	*/
	setStateFromJSON(data){
		// if data is empty, there is nothing to do
		if(typeof data === "object" && data != null){
			// we update the orientation of the character
			if(UTIL.isVector2(data.orient)){
				this.setLook(data.orient);
			}
			// if the position is set
			if(UTIL.isVector3(data.pos)){
				this.body.position.copy(data.pos);
			}
			// set the state of the character
			if(typeof data.state === "number"){
				this.isGrounded  = !!(data.state &     0b1);
				this.isCrounched = !!(data.state &    0b10);
				this.isJumping   = !!(data.state &   0b100);
				this.isFiring    = !!(data.state &  0b1000);
				this.isReloading = !!(data.state & 0b10000);
			}
			if(typeof data.weap === "number") this.currentWeapon = data.weap;
		}
	}

	/**
	Define how the character should be displayed based on the given orientation
	*/
	setlook(orientation){

	}

	animate(animation){

	}

}
HERSTAL.CharacterRender = CharacterRender;
