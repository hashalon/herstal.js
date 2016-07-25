/**
 * Class to render the world based on the HERSTAL shared world
 * @param {HERSTAL.World} world - the world to render
 * @param {THREE.Camera} camera - the camera from where to render the world, can be null
 */
function WorldRender (world, camera){
	this.world  = world;
	this.camera = camera;

	this.scene = new THREE.Scene();

	this.characterModels = [];
}
WorldRender.prototype.constructor = HERSTAL.WorldRender = WorldRender;

WorldRender.prototype.addCharacterModel = function( characterModel ){
	// since we are in a web browser, we can use the method addElement defined in HERSTAL shared
	// TODO this.characterModels.adElement(characterModel);
	// the characterModel shoudl in which world it is
	characterModel.worldRender = this;
	// we add the model itself to the scene
	this.scene.add(characterModel.mesh);
};

WorldRender.prototype.removeCharacterModel = function( characterModel ){
	// TODO var index = this.characterModels.removElement( characterModel );
	// if the character was in the array
	if(index > -1){
		characterModel.worldRender = null;
		this.scene.remove(characterModel.mesh);
	}
};
