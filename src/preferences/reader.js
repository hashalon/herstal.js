var HERSTAL = window.HERSTAL || {};

/**
Namespace to handle loading and saving user configuration
*/
var CONFIG = HERSTAL.CONFIG = {
	// should we be using localStorage ?
	// set to true only if preferences form
	// and game canvas are in the same document /!\
	localMode: true,

	// is local file ?
	isLocalFile: !document.location.host,

	// save the content of preferences to localStorage or name
	save: function(){
		// if we are playing from a local file store to window.name
		if(CONFIG.isLocalFile && CONFIG.localMode){
			// we convert the preferences into JSON string
			window.name = JSON.stringify(CONFIG.preferences);
			console.log("saved data to window.name !");
		}else{ // http file
			for( var index in CONFIG.preferences ){
				// we recover the option
				var option = CONFIG.preferences[index];
				// we store it locally
				localStorage.setItem(index,JSON.stringify(option));
			}
			console.log("saved data to localStorage !");
		}
	},
	// load the content from localStorage or name to preferences
	load: function(){
		// if we are playing from a local file retrieve from window.name
		if(CONFIG.isLocalFile && CONFIG.localMode){
			try{
				// we convert the preferences into JSON string
				CONFIG.preferences = JSON.parse(window.name);
				console.log("Loaded data from window.name !");
			}catch(e){
				CONFIG.preferences = null;
			}
		}else{ // http file
			CONFIG.preferences = {};
			// for each element stored
			for( var index in localStorage ){
				// we recover the option
				var option = localStorage.getItem(index);
				// store it in the preferences
				CONFIG.preferences[index] = JSON.parse(option);
			}
			console.log("Loaded data from localStorage !");
		}
	},
	// set the default values, based on the keyboard layout
	reset: function(lang){
		// we set up the default preferences of the player
		var config = CONFIG.preferences = {};

		// player attributes
		config.name  = "unnamed"; // user name
		config.model = "default"; // player model

		// colors for team and player
		config.colorAlpha = "#1133BB"; // allies or team 1
		config.colorBeta  = "#BB3311"; // enemies or team 2
		config.colorOwn1  = "#888888"; // player primary color
		config.colorOwn2  = "#dddddd"; // player secondary color
		config.colorLaser = "#FFFF66"; // color of the instant gib laser
		config.colorRelative = false; // are team color relative to the player ?

		// set default display configuration
		config.isFullscreen = false;
		config.displayX = 1280;
		config.displayY =  720;

		// set default audio configuration
		config.volumeMaster = 50;
		config.volumeEffect = 50;
		config.volumeMusic  = 50;

		// mouse controls
		config.mouseS = 50; // mouse sensibility
		config.invertX = false;
		config.invertY = false;

		// layout is QWERTY
		// movements controls
		config.moveF = { btn: 87 }; // W
		config.moveB = { btn: 83 }; // S
		config.moveL = { btn: 65 }; // A
		config.moveR = { btn: 68 }; // D
		// jump & crounch
		config.jump    = { btn: 32 }; // SPACE
		config.crounch = { btn: 16 }; // SHIFT
		// fire
		config.fire1 = { btn: 0, isMouse: true }; // Mouse Button Left
		config.fire2 = { btn: 2, isMouse: true }; // Mouse Button Right
		// interact
		config.use    = { btn: 69 }; // E
		config.reload = { btn: 82 }; // R
		config.melee  = { btn: 81 }; // Q
		config.zoom   = { btn:  1, isMouse: true }; // Mouse Wheel Press
		// weapon selection
		config.prevWeap = { btn: -1, isMouse: true }; // Mouse Wheel Up
		config.nextWeap = { btn: -2, isMouse: true }; // Mouse Wheel Down
		config.weap1 = { btn: 49 }; // 1
		config.weap2 = { btn: 50 }; // 2
		config.weap3 = { btn: 51 }; // 3
		config.weap4 = { btn: 52 }; // 4
		config.weap5 = { btn: 53 }; // 5
		config.weap6 = { btn: 54 }; // 6
		config.weap7 = { btn: 55 }; // 7
		config.weap8 = { btn: 56 }; // 8
		config.weap9 = { btn: 57 }; // 9
		config.weap0 = { btn: 48 }; // 0

		// based on the given language, we correct the movement keys
		if(typeof lang === "string"){
			switch(lang.toLowerCase()){
				/*
				// QWERTZ
				case "de": case "hr": case "sq":
				case "bs": case "sl": case "rm":
					break;
				*/
				// AZERTY
				case "fr":
					config.moveF.btn = 90; // Z
					config.moveL.btn = 81; // Q
					config.melee.btn = 68; // A
					break;
			}
		}
		console.log("Restored default data !");
	},
};

// read the data stored in localStorage
CONFIG.load();

// is this the first time using HERSTAL.js on this domain ?
var firstSetup = false;
// if null or empty, then it is the first setup
if(!CONFIG.preferences) firstSetup = true;
else if(!CONFIG.preferences.name) firstSetup = true;

// if preferences are not set
if(firstSetup){
	var lang = navigator.language || navigator.languages[0];
	lang = lang.substr(0,2); // only first two characters
	// we need to recover the keyboard layout of the user
	CONFIG.reset(lang);
}
