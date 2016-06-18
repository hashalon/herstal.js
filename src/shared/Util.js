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
/**
 * Add element only if it's not already present in the list
 */
Array.prototype.addElement = function(e){
	var index = this.indexOf(e);
	// if the element is not already in the list
	// we add it to the end of the list
	if(index == -1){
		this[this.length] = e;
		// we return the position of the element in the array
		return this.length-1;
	}
	return -1; // the element was already in the array
};
/**
 * Remove an element from the list
 */
Array.prototype.removeElement = function(e){
	var index = this.indexOf(e);
	// if the element is in the list
	// we can remove it
	if(index > -1) this.splice(index, 1);
	// we return the old position of the element in the array
	return index;
};
