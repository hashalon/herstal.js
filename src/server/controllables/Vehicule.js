/**
Base class for all vehicules
@class Vehicule @extends Controllable
*/
class Vehicule extends HERSTAL.Controllable{
	/**
	Create a vehicule which can be piloted by characters
	@constructor
	*/
	constructor(position, orientation, options){
		options = options || {};
		super(null);

		// id of the vehicule for online identification
		this.id = Vehicule.idCounter++;
		// keep id safe
		if(!Number.isSafeInteger(Vehicule.idCounter)){
			Vehicule.idCounter = Number.MIN_SAFE_INTEGER;
		}

		this.pilot = null; // the character piloting the vehicule

		this.isDestroyed = false;
	}

	/**
	Update function for all vehicules
	@method update
	*/
	update(){
		if(this.pilot){
			if(this.pilot.isDead) this.pilot = null;
		}
		// if the vehicule is destroyed
		if(this.isDestroyed) this.ejectPilot();
	}

	addDamage(damage){
		var vehiculeDamage = damage * Vehicule.PROTECTION;
		damage -= vehiculeDamage; // we define damage taken by the pilot
		super.addDamage(vehiculeDamage);
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
HERSTAL.Vehicule = Vehicule;

// id counter for vehicules
Vehicule.idCounter = 0;

Vehicule.PROTECTION = 9/10; // number of damage taken by the vehicule
