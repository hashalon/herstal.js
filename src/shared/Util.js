// adds function for CANNON.js objects
/**
 * Get the angle between this vector and the given vector.
 * @method getAngle
 * @param {Vec3} v Vector to get the angle from
 * @return {number}
 */
CANNON.Vec3.prototype.getAngle = function(v){
	// we need two vectors
	var v1 = this.clone();
	var v2 = v ? new CANNON.Vec3(v.x, v.y, v.z) : CANNON.Vec3.UNIT_Y;

	// acos(dot(v1 / norm(v1), v2 / norm(v2)))
	v1.normalize();
	v2.normalize();
	return Math.acos( v1.dot(v2) );
};
