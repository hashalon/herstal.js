// we need modules some other modules
var CANNON, module;
if(typeof module === 'undefined'){
	module = {};
}
if(typeof CANNON === 'undefined'){
	throw new Error('Herstal require CANNON.js to work');
}

var WORLD = new CANNON.World();
WORLD.gravity.set(0, -100, 0);
WORLD.defaultContactMaterial.friction = 0.1;
