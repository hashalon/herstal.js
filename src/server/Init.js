// Announce the Server is Starting
console.log('Server Starting...');

/* INIT LIBRARIES */

// there is no need in using a minified file for the server
// but the files needs to be in the same directory
var HTTP     = require('http');
var SOCKETIO = require('socket.io');
var CANNON   = require('cannon');
var PATROL   = require('patroljs');

if(!HTTP)     throw new Error('herstal needs http to manage requests');
if(!SOCKETIO) throw new Error('herstal needs socketio to work');
if(!CANNON)   throw new Error('herstal needs CANNON.js to work');
if(!PATROL)   throw new Error('AI in herstal needs PatrolJS to work');
