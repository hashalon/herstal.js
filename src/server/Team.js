/**
Store collisions group and mask for each team
collision if : (A.group & B.mask) && (B.group & A.mask)
*/
// collision is accessible to be able to redefine
// collision filters and add more teams
var COLLISION = HERSTAL.COLLISION = [
	{ group: 0b000010, mask: 0b111111 }, // NONE
	{ group: 0b000100, mask: 0b111011 }, // TEAM 1
	{ group: 0b001000, mask: 0b110111 }, // TEAM 2
	{ group: 0b010000, mask: 0b101111 }, // TEAM 3
	{ group: 0b100000, mask: 0b011111 }, // TEAM 4
];
COLLISION.map =
  { group: 0b000001, mask: 0b111110 }; // MAP

/**
Manage teams
*/
var TEAM = {
	/**
	@method getCollisionFilter
	@param {Number} id The id of the team (0 for NONE)
	*/
	getCollisionFilter: function(id){
		// if id is out of bound
		if( id < 0 || COLLISION.length <= id ){
			id = 0; // we reset id
		}
		// we return the filter associated with this team
		return COLLISION[id];
	},
};
