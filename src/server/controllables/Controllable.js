/**
Abstract class to be controlled by a controller
@class Controllable
*/
class Controllable{
	/**
	@constructor

	*/
	constructor(controller){
		// the controller controlling this controllable
		this.controller = controller || null;
		// the world in which the controllable exists
		this.world = null;
		// we recover the filter based on the team of the controller
		this.team = controller != null ? controller.team || 0 : 0;
	}
	/**
	Read the state of the controllable and generate a json file from it
	Needs to be implemented in each extending classes
	*/
	getJSONFromState(){}

	/**
	Return  the position of the Controllable
	@private To implement in extending classes
	@method get Position
	@return {Vec3} The position in space
	*/
	get Position(){}

  /**
	Return the orientation of the Controllable
	@private To implement in extending classes
	@method get Orientation
	@return {Vec2} The orientation in space
	*/
	get Orientation(){}

	/**
	Return the collisionFilterMask of the Controllable
	@private To implement in extending classes
	@method get FilterMask
	@return {Number} The filter mask of the controllable
	*/
	get FilterMask(){}

	/**
	Set the collisionFilterMask of the Controllable
	@private To implement in extending classes
	@method get FilterMask
	@param {Number} mask The filter mask of the controllable
	*/
	set FilterMask(mask){}

	/**
	Return the main CANNON.body of the controllable
	@private To implement in extending classes
	@method get Body
	@param {Body} The main CANNON Body
	*/
	get Body(){}

	/**
	To implement: Global update function of the controllable
	*/
	update(){}

	/**
	To implement: addDamage to controllable
	*/
	addDamage(damage){}

}
HERSTAL.Controllable = Controllable;
