if(!window || !document) throw new Error("This librairy is meant to be used in a web browser");

var HERSTAL = window.HERSTAL || {};

// we need socketio to send data to the server
if(!io) throw new Error('herstal needs Socket.io to work');
// we need THREE.js to render the game
if(!THREE) throw new Error('herstal needs THREE.js to render the game');
// we need a configuration for the player
if(!HERSTAL.CONFIG) throw new Error('herstal is not configured');
// we need a server address to connect to
if(!HERSTAL.SERVER_ADDRESS) throw new Error('no server address specified');
