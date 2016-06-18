/**
 * Class to manage characters appearance and animations
 */
function CharacterModel( character, options ){
	options = options || {};

	// the worldRender of the model
	this.worldRender = null;
	this.character   = character;
	
	this.character.characterModel = this;

	this.geometry = null;
	this.material = null;
	this.mesh = new THREE.Mesh(this.geometry, this.material);
}
// we add the class to the module
HERSTALclient.CharacterModel = CharacterModel;
CharacterModel.prototype.constructor = CharacterModel;

CharacterModel.prototype.animate = function( animation ){

};
