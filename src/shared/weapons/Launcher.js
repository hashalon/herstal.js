/**
@class Launcher
*/
class Launcher extends HERSTAL.Weapon {
	constructor(name, character, options, projectile){
		options = options || {};
		// call Weapon constructor
		super(name, character, options);
		this.projectile = projectile;
	}

	/**
	fire a projectile
	@method fire
	*/
	fire(){

	}

}
// we had the class to the Namespace
HERSTAL.Launcher = Launcher;
