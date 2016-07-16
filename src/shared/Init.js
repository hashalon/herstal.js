// we use a hack to be able to use the library in both node an the browser
// if window is not set, we will have an error
if(!window) window = {};
// if module is not set, we will have an error
if(!module) module = {};

// the library must be usable in both node and browser
var HERSTAL = module.exports = window.HERSTAL || {};

// we fix the overall update to 60FPS
HERSTAL.__FPS = 60;

// Cannon is either already part of the html page or is a module to import
var CANNON = window.CANNON || require('./cannon.js');
if(!CANNON) throw new Error('herstal.shared needs CANNON.js to work');
