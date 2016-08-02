/**
Abstract class to control a controllable
@class Controller
*/
class Controller{
	/**
	@constructor
	@param {World} world The world of the controller
	*/
	constructor(team){
		// we set the team of the controller (default is none)
		this.team = typeof options.team === "number" ? options.team : 0;
		this.inputs = null;
		this.controllable = null;
		this.world = null;
	}
}
HERSTAL.Controller = Controller;
