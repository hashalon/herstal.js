function World(){

	this.step = 1/HERSTALshared.__FPS;

	this.cannonWorld = new CANNON.World();
	this.cannonWorld.gravity.set(0, -100, 0);
	this.cannonWorld.defaultContactMaterial.friction = 0.1;

	// worldRender used in HERSTALclient
	this.worldRender = null;

	// we create a new material for the characters
	this.characterMaterial = new CANNON.Material("character");
	this.cannonWorld.addContactMaterial(
		new CANNON.ContactMaterial(
			Character.MATERIAL, WORLD.defaultMaterial, {
				friction:    0,
				restitution: 0,
				contactEquationStiffness:  1e8,
				contactEquationRelaxation:   3,
			}
		)
	);

	this.characters = [];
}
HERSTALshared.World = World;
World.prototype.constructor = World;

/**
 * The function that must be executed 60 times per seconds
 */
World.prototype.update = function(){
	var i;
	// we update the overall movement of the characters
	for(i=0; i<this.characters.length; ++i){
		this.characters[i].updateAll();
	}
	// we update the world physics
	world.step(this.step);
	// we update the position of the characters based on the platform he's standing on
	for(i=0; i<this.characters.length; ++i){
		this.characters[i].updatePlatformPosition();
	}
};

World.prototype.addCharacter = function( character ){
	// we keep track of it in a list
	this.characters.addElement(character);
	// the character is part of this world
	character.world = this;
	// we add its body to the cannonWorld
	this.cannonWorld.addBody(character.body);

	// if HERSTALclient is defined
	if( this.worldRender && character.characterModel ){
		this.worldRender.addCharacterModel(character.characterModel);
	}
};

World.prototype.removeCharacter = function( character ){
	var index = this.characters.removeElement( character );
	// if the character was in the array
	if(index > -1){
		character.world = null;
		this.cannonWorld.removeBody(character.body);

		// if HERSTALclient is defined
		if( this.worldRender && character.characterModel ){
			this.worldRender.removeCharacter(character.characterModel);
		}
	}
};
