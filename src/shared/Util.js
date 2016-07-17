// adds function for CANNON.js objects
/**
Get the angle between this vector and the given vector.
@method getAngle
@param {Vec3} v Vector to get the angle from
@return {Number} the angle between both vectors
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
Add element only if it's not already present in the list
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
Remove an element from the list
*/
Array.prototype.removeElement = function(e){
	var index = this.indexOf(e);
	// if the element is in the list
	// we can remove it
	if(index > -1) this.splice(index, 1);
	// we return the old position of the element in the array
	return index;
};

HERSTAL.UTIL = {
	/**
	Return a normalized vector pointing at the left of the quaternion
	@method getLeft
	@param {Quaternion} q A Quaternion
	@return {Vec3} A vector pointing at the left of the quaternion
	*/
	getLeft: function(){
		return new CANNON.Vec3(
			1-2*( q.y*q.z - q.z*q.z ),
        2*( q.x*q.y + q.z*q.w ),
        2*( q.x*q.z - q.y*q.w )
		);
	},
	/**
	Return a normalized vector pointing up from the quaternion
	@method getUp
	@param {Quaternion} q A Quaternion
	@return {Vec3} A vector pointing up from the quaternion
	*/
	getUp: function(){
		return new CANNON.Vec3(
        2*( q.x*q.y - q.z*q.w ),
      1-2*( q.x*q.x - q.z*q.z ),
        2*( q.y*q.z + q.x*q.w )
    );
	},
	/**
	Return a normalized vector pointing forward from the quaternion
	@method getForward
	@param {Quaternion} q A Quaternion
	@return {Vec3} A vector pointing forward from the quaternion
	*/
	getForward: function(){
		return new CANNON.Vec3(
        2*( q.x*q.z + q.w*q.y ),
        2*( q.y*q.x - q.w*q.x ),
      1-2*( q.x*q.x + q.y*q.y )
    );
	},
	/**
	Return true if the given object is a 3D Vector
	@method isVector3
	@param {Object} v The supposed vector
	@return {Boolean} True if it's a vector 3D
	*/
	isVector3: function(v){
		if(typeof v === "object"){
			return typeof v.x === typeof v.y === typeof v.z === "number";
		}
		return false;
	},
	/**
	Return a Quaternion oriented by the given vectors
	@method lookRotation
	@param {Vec3} forward The vector pointing forward
	@param {Vec3} [up] The vector pointing up
	*/
	lookRotation(forward, up){
		up = up || CANNON.Vec3.UP;
		var v2 = forward.unit();
		var v0 = up.unit(); v0.cross(v2, v0).normalize();
		var v1 = v2.cross(v0);
		// our result quaternion, and two numbers
		var q = new CANNON.Quaternion(), a, b;
		// we calculate the components of the quaternion
		a = v0.x + v1.y + v2.z;
    if(a > 0){
      b = Math.sqrt(a + 1);
      q.w = 0.5*b;
      b = 0.5/b;
      q.x = (v1.z - v2.y)*b;
      q.y = (v2.x - v0.z)*b;
      q.z = (v0.y - v1.x)*b;
      return q;
    }
    if((v0.x >= v1.y) && (v0.x >= v2.z)){
        a = Math.sqrt(1 + v0.x - v1.y - v2.z);
        b = 0.5/a;
        q.x = 0.5*a;
        q.y = (v0.y + v1.x)*b;
        q.z = (v0.z + v2.x)*b;
        q.w = (v1.z - v2.y)*b;
        return q;
    }
    if(v1.y > v2.z){
        a = Math.sqrt(1 + v1.y - v0.x - v2.z);
        b = 0.5/a;
        q.x = (v1.x + v0.y)*b;
        q.y = 0.5*a;
        q.z = (v2.y + v1.z)*b;
        q.w = (v2.x - v0.z)*b;
        return q;
    }
    a = Math.sqrt(1 + v2.z - v0.x - v1.y);
    b = 0.5/a;
    q.x = (v2.x + v0.z)*b;
    q.y = (v2.y + v1.z)*b;
    q.z = 0.5*a;
    q.w = (v0.y - v1.x)*b;
    return q;
	},
};
