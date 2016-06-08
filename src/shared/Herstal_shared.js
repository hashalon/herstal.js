// Export classes
module.exports = {
	version :  require('../../package.json').version,

	Physic:    require('Physic.js'),
	Player:    require('./character/Player.js'),
	Character: require('./character/Character.js'),
};
