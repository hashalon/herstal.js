// there is no need in using a minified file for the server
// but the files needs to be in the same directory
var HTTP     = require('http');
var SOCKETIO = require('socket.io');
var HERSTAL  = require('./herstal.shared.js');

if(!HTTP)     throw new Error('herstal.server needs http to manage requests');
if(!SOCKETIO) throw new Error('herstal.server needs socketio to work');
if(!HERSTAL)  throw new Error('herstal.server needs herstal.shared to work');

// we expose our module
module.exports = HERSTAL;
