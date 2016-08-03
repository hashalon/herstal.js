/**
Vehicule based on the Character class
@class Mecha @extends Character
*/
class Mecha extends HERSTAL.Character{
	/**
	Create a mecha which can be piloted by a character
	@constructor
	*/
	constructor(position, orientation, weapons, options){
		options = options || {};
		options.unsetID = true; // we add a tag to avoid creating an ID
		options.noHead  = true; // a mecha doesn't have a head
		super(null, position, orientation, weapons, options);

		// id of the mecha for online identification
		this.id = Mecha.idCounter++;
		// keep id safe
		if(!Number.isSafeInteger(Mecha.idCounter)){
			Mecha.idCounter = Number.MIN_SAFE_INTEGER;
		}

		this.pilot = null; // the character piloting the mecha
	}

	/**
	Update function of the mecha
	@method update
	*/
	update(){
		super.update();
		if(this.pilot){
			if(this.pilot.isDead) this.pilot = null; // no more pilot
		}
		// if the mecha is dead, eject the pilot !
		if(this.isDead) this.ejectPilot();
	}

	addDamage(damage){
		var mechaDamage = damage * Mecha.PROTECTION;
		damage -= mechaDamage; // we define damage taken by the pilot
		super.addDamage(mechaDamage);
		// if the mecha has a pilot
		if(this.pilot !== null){
			this.pilot.addDamage(damage);
		}
	}

	/**
	Makes the character enters the mecha to pilot it
	@method setPilot
	@param {Character} character the new pilot
	*/
	setPilot(character){
		// we can asign a new pilot only if there is none already
		if(this.pilot === null){
			this.pilot = character;
			this.pilot.inVehicule = true;
			this.controller = this.pilot.controller;
		}
	}

	/**
	Eject the pilot from the mecha
	@method ejectPilot
	*/
	ejectPilot(){
		if(this.pilot !== null){
			this.pilot.inVehicule = false;
			// TODO impulse character
			this.pilot      = null; // no more pilot
			this.controller = null; // no more controller
		}
	}
}
HERSTAL.Mecha = Mecha;

// id counter for mechas
Mecha.idCounter = 0;

Mecha.PROTECTION = 9/10; // number of damage taken by the vehicule
