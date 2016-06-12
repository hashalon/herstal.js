// parameters for the app
var options = options || {};

// we need modules some other modules
var module, window;
// we use a hack to be able to use the library in both node an the browser
// if window is not set, we will have an error
if(!window) window = {};
// if module is not set, we will have an error
if(!module) module = {
	// we link exports to the window variable
	get exports() {
		return window.HERSTAL;
	},
	set exports(exports)  {
		window.HERSTAL = exports;
	}
};

var CANNON = require('../../lib/cannon.min.js');
if(!CANNON) throw new Error('Herstal.shared needs CANNON.js to work');

var WORLD = new CANNON.World();
WORLD.gravity.set(0, -100, 0);
WORLD.defaultContactMaterial.friction = 0.1;
