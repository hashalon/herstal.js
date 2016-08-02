/**
Base class for AI bots
@class Bot @extends Controller
*/
class Bot extends HERSTAL.Controller{
	/**
	@constructor
	*/
	constructor(team, options){
		options = options || {};
		super(team);

		// mesh to help the Bot move in the map
		this.navMesh = world.navMesh;

		// field of view of the bot
		this.fov = options.fieldOfView  || 120;
		// how fast does the bot react to new events
		this.react = options.reactivity ||  10;

		// the objective of the bot (where he wants to go)
		this.objective = null;
	}

	/**
	@method update
	*/
	update(){
		if(this.controllable !== null){
			this.inputs = {};
		}
	}

	/**
	@method Return true if bot sees one of the given target in one of the given points
	@param {Body} target The target we want to see
	@param {Array} offsets Points to check for the target (if it's really big)
	*/
	seeTarget(targets){
		for(var i=0; i<targets.length; ++i){
			var target = targets[i];

		}
		return false;
	}

	/**
	Get the path the bot must take to join it's objective
	@method getNewPath
	*/
	getNewPath(){
		// https://github.com/nickjanssen/PatrolJS
	}
}
