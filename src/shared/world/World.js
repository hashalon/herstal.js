/**
The world of the game
@class World
*/
class World {
	/**
	@constructor
	*/
	constructor(){
		this.step = 1/HERSTAL.__FPS;

		this.cannonWorld = new CANNON.World();
		this.cannonWorld.gravity.set(0, -100, 0);
		this.cannonWorld.defaultContactMaterial.friction = 0.1;

		// we add the character material to this world
		this.cannonWorld.addContactMaterial(
			new CANNON.ContactMaterial(
				HERSTAL.Character.MATERIAL, WORLD.defaultMaterial, {
					friction:    0,
					restitution: 0,
					contactEquationStiffness:  1e8,
					contactEquationRelaxation:   3,
				}
			)
		);

		this.players     = [];
		this.characters  = [];
		this.weapons     = [];
		this.projectiles = [];
		this.mapElements = [];
	}

	/**
	The function that must be executed 60 times per seconds
	*/
	update(){
		var i;
		// we update each characters
		for(i=0; i<this.characters.length; ++i){
			this.characters[i].update();
		}
		// we update the world physics
		world.step(this.step);
		// we update the position of the characters based on the platform he's standing on
		for(i=0; i<this.characters.length; ++i){
			this.characters[i].updatePlatformPosition();
		}
	}
	/**
	Add the character to the list of characters
	@method addCharacter
	@param {Character} character The character to add to the array
	*/
	addCharacter(character){
		// if the object is a character
		if(character instanceof Character){
			// we keep track of it in a list
			this.characters.addElement(character);
			// the character is part of this world
			character.world = this;
			// we add its body to the cannonWorld
			this.cannonWorld.addBody(character.body);
		}
	}
	/**
	Remove the character from the list of characters
	@method removeCharacter
	@param {Character} character The character to remove
	*/
	removeCharacter(character){
		var index = this.characters.removeElement( character );
		// if the character was in the array
		if(index > -1){
			character.world = null;
			this.cannonWorld.removeBody(character.body);
		}
	}
}
HERSTAL.World = World;
