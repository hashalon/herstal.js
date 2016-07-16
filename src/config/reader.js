var HERSTAL = window.HERSTAL || {};

// should we be using localStorage ?
// set to true only if preferences form
// and game canvas are in the same document /!\
HERSTAL.localMode   = true;
HERSTAL.isLocalFile = !document.location.host; // is local file ?

// save the content of preferences to localStorage or name
HERSTAL.save = function(){
	// if we are playing from a local file store to window.name
	if(HERSTALprefs.isLocalFile && HERSTALprefs.localMode){
		// we convert the preferences into JSON string
		window.name = JSON.stringify(HERSTALprefs.preferences);
		console.log("saved data to window.name !");
	}else{ // http file
		for( var index in HERSTALprefs.preferences ){
			// we recover the option
			var option = HERSTALprefs.preferences[index];
			// we store it locally
			localStorage.setItem(index,JSON.stringify(option));
		}
		console.log("saved data to localStorage !");
	}
};

// load the content from localStorage or name to preferences
HERSTAL.load = function(){
	// if we are playing from a local file retrieve from window.name
	if(HERSTALprefs.isLocalFile && HERSTALprefs.localMode){
		try{
			// we convert the preferences into JSON string
			HERSTALprefs.preferences = JSON.parse(window.name);
			console.log("Loaded data from window.name !");
		}catch(e){
			HERSTALprefs.preferences = null;
		}
	}else{ // http file
		HERSTALprefs.preferences = {};
		// for each element stored
		for( var index in localStorage ){
			// we recover the option
			var option = localStorage.getItem(index);
			// store it in the preferences
			HERSTALprefs.preferences[index] = JSON.parse(option);
		}
		console.log("Loaded data from localStorage !");
	}
};

// set the default values, based on the keyboard layout
HERSTAL.reset = function(lang){
	// we set up the default preferences of the player
	var prefs = HERSTALprefs.preferences = {};

	// player attributes
	prefs.name  = "unnamed"; // user name
	prefs.model = "default"; // player model

	// colors for team and player
	prefs.colorAlpha = "#1133BB"; // allies or team 1
	prefs.colorBeta  = "#BB3311"; // enemies or team 2
	prefs.colorOwn1  = "#888888"; // player primary color
	prefs.colorOwn2  = "#dddddd"; // player secondary color
	prefs.colorLaser = "#FFFF66"; // color of the instant gib laser
	prefs.colorRelative = false; // are team color relative to the player ?

	// set default display configuration
	prefs.isFullscreen = false;
	prefs.displayX = 1280;
	prefs.displayY =  720;

	// set default audio configuration
	prefs.volumeMaster = 50;
	prefs.volumeEffect = 50;
	prefs.volumeMusic  = 50;

	// mouse controls
	prefs.mouseS = 50; // mouse sensibility
	prefs.invertX = false;
	prefs.invertY = false;

	// layout is QWERTY
	// movements controls
	prefs.moveF = { btn: 87 }; // W
	prefs.moveB = { btn: 83 }; // S
	prefs.moveL = { btn: 65 }; // A
	prefs.moveR = { btn: 68 }; // D
	// jump & crounch
	prefs.jump    = { btn: 32 }; // SPACE
	prefs.crounch = { btn: 16 }; // SHIFT
	// fire
	prefs.fire1 = { btn: 0, isMouse: true }; // Mouse Button Left
	prefs.fire2 = { btn: 2, isMouse: true }; // Mouse Button Right
	// interact
	prefs.use    = { btn: 69 }; // E
	prefs.reload = { btn: 82 }; // R
	prefs.melee  = { btn: 81 }; // Q
	prefs.zoom   = { btn:  1, isMouse: true }; // Mouse Wheel Press
	// weapon selection
	prefs.prevWeap = { btn: -1, isMouse: true }; // Mouse Wheel Up
	prefs.nextWeap = { btn: -2, isMouse: true }; // Mouse Wheel Down
	prefs.weap1 = { btn: 49 }; // 1
	prefs.weap2 = { btn: 50 }; // 2
	prefs.weap3 = { btn: 51 }; // 3
	prefs.weap4 = { btn: 52 }; // 4
	prefs.weap5 = { btn: 53 }; // 5
	prefs.weap6 = { btn: 54 }; // 6
	prefs.weap7 = { btn: 55 }; // 7
	prefs.weap8 = { btn: 56 }; // 8
	prefs.weap9 = { btn: 57 }; // 9
	prefs.weap0 = { btn: 48 }; // 0

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
				prefs.moveF.btn = 90; // Z
				prefs.moveL.btn = 81; // Q
				prefs.melee.btn = 68; // A
				break;
		}
	}
	console.log("Restored default data !");
};

// read the data stored in localStorage
HERSTAL.load();

// is this the first time using HERSTAL.js on this domain ?
var firstSetup = false;
// if null or empty, then it is the first setup
if(!HERSTAL.preferences) firstSetup = true;
else if(!HERSTAL.preferences.name) firstSetup = true;

// if preferences are not set
if(firstSetup){
	var lang = navigator.language || navigator.languages[0];
	lang = lang.substr(0,2); // only first two characters
	// we need to recover the keyboard layout of the user
	HERSTAL.reset(lang);
}
