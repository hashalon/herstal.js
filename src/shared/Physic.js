module.exports = Physic;

var CANNON = require('../../lib/cannon.js');

var PHYSIC = {};

PHYSIC.characterFilter = {
	group : 2,
	mask  : 2
};

PHYSIC.world = new CANNON.World();
PHYSIC.world.gravity.set(0, -100, 0);
PHYSIC.world.defaultContactMaterial.friction = 0.1;
