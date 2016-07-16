/**
Class to manage characters appearance and animations
@class CharacterRender
*/
class CharacterRender {
	constructor(character, options){
		options = options || {};

		// the worldRender of the model
		this.worldRender = null;
		this.character   = character;

		this.character.characterRender = this;

		this.geometry = null;
		this.material = null;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}

	animate(animation){

	}
}
HERSTAL.CharacterRender = CharacterRender;
