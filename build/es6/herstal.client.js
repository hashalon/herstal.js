(function(undefined) {

// parameters for the app
var options = options || {};

var io, CooMan, HERSTAL;
if(!io)     throw new Error('Herstal.client needs Socket.io to work');
if(!CooMan) throw new Error('Herstal.client needs CookieManager to work');
if(!HERSTAL) throw new Error('Herstal.client needs Herstal.shared to work');
if(typeof address != "string") throw new Error('address is not of the right type');

// we create a socket that will allow us to communicate with the server
var SOCKET = io.connect(address);

if (typeof define === 'function' && typeof define.amd === 'object') {
define(function(exports) {  });
} else {

}
})();