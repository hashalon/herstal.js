// adds PI*2 and PI/2 to Math
Math.PI2 = Math.PI*2;
Math.HPI = Math.PI*0.5;

// we add constant to convert angles easily
Math.RAD2DEG = 180/Math.PI;
Math.DEG2RAD = Math.PI/180;

// we add a function to generate random number within [-1,1]
Math.random2 = function(){
	return Math.random()*2 - 1;
}

// we add a function to generate random numbers within a range
Math.randomRange = function(min, max){
	return min + Math.random() * (max - min);
}

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

// adds function to Array objects
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
	Convert a vector to array
	@method vectorToArray @deprecated
	@param {Object} vec A 2D Vector or 3D Vector
	@return {Array} the array
	*/
	vectorToArray: function(vec){
		// if it has z component, return an array of length 3
		if(vec.z != null) return [vec.x, vec.y, vec.z];
		// otherwise return an array of length 2
		return [vec.x, vec.y];
	},
	/**
	Convert an array into a vector
	@method arrayToVector @deprecated
	@param {Array} the array to convert
	@return {Object | Vec3} The vector 2D or 3D
	*/
	arrayToVector: function(arr){
		// if array is longer than 2, return a cannon.vec3
		if(arr.length > 2) return new CANNON.Vec3(arr[0], arr[1], arr[2]);
		// otherwise return a object
		return {x: arr[0], y: arr[1]};
	},
	/**
	Return true if the given object is a 2D Vector
	@method isVector2
	@param {Object} v The supposed vector
	@return {Boolean} True if it's a vector 2D
	*/
	isVector2: function(v){
		if(typeof v === "object" && v !== null){
			return typeof v.x === typeof v.y === "number";
		}
		return false;
	},
	/**
	Return true if the given object is a 3D Vector
	@method isVector3
	@param {Object} v The supposed vector
	@return {Boolean} True if it's a vector 3D
	*/
	isVector3: function(v){
		if(typeof v === "object" && v !== null){
			return typeof v.x === typeof v.y === typeof v.z === "number";
		}
		return false;
	},
	/**
	Return a normalized vector pointing at the left of the quaternion
	@method getLeft
	@param {Quaternion} q A Quaternion
	@return {Vec3} A vector pointing at the left of the quaternion
	*/
	getLeft: function(q){
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
	getUp: function(q){
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
	getForward: function(q){
		return new CANNON.Vec3(
        2*( q.x*q.z + q.w*q.y ),
        2*( q.y*q.x - q.w*q.x ),
      1-2*( q.x*q.x + q.y*q.y )
    );
	},
	/**
	Return a vector oriented according to the given angles
	@method getForwardFromAngles
	@param {Object} o Orientation horizontaly and verticaly
	@return {Vec3} The direction given by those angles
	*/
	getForwardFromAngles: function(o){
		var y = Math.sin(o.y);
		return new CANNON.Vec3(Math.cos(o.x) - y, y, Math.sin(o.x) - y);
	},
	/**
	Return a Quaternion oriented by the given vectors
	@method lookRotation
	@param {Vec3} forward The vector pointing forward
	@param {Vec3} [up] The vector pointing up
	*/
	lookRotation(forward, up){
		up = up || CANNON.Vec3.UNIT_Y;
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
