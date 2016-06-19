var CooMan = CooMan || {}; // CookieManager
CooMan.options = CooMan.options || {};

// This script allow to read and write cookies to store user preferences.
CooMan.reset = function(){
	// we set up default user characteristics
	var O = CooMan.options;
	O.name  = "noname"; // user name
	O.model = 0;        // the player model
	O.colorRelative = false; // are team color relative to the player ?
	// colors for team and player
	O.colorAlpha = "#0000FF"; // color of allies
	O.colorBeta  = "#FF0000"; // color of enemies
	O.colorOwn1  = "#00FF00"; // own primary   color (visible in free for all)
	O.colorOwn2  = "#FFFFFF"; // own secondary color
	O.colorLaser = "#FFFF00"; // color of the instant gib laser
	// we set up default display configuration
	O.isFullscreen = false;
	O.displayX = 1280;
	O.displayY =  720;
	// we set up default audio configuration
	O.volumeMaster = 50;
	O.volumeEffect = 50;
	O.volumeMusic  = 50;
	// we set up default user controls
	O.mouseS  = 50; // mouse sensibility
	O.invertX = false;
	O.invertY = false;
	// movements
	O.moveF = { btn: 87 }; // W
	O.moveB = { btn: 83 }; // S
	O.moveL = { btn: 65 }; // A
	O.moveR = { btn: 68 }; // D
	// jump & crounch
	O.jump    = { btn: 32 }; // SPACE
	O.crounch = { btn: 16 }; // SHIFT
	// fire
	O.fire1 = { btn: 0, isMouse: true }; // Mouse Button Left
	O.fire2 = { btn: 2, isMouse: true }; // Mouse Button Right
	// interact
	O.use    = { btn: 69 }; // E
	O.reload = { btn: 82 }; // R
	O.melee  = { btn: 81 }; // Q
	O.zoom   = { btn:  1, isMouse: true }; // Mouse Wheel Press
	// weapon selection
	O.prevWeap = { btn: -1, isMouse: true }; // Mouse Wheel Up
	O.nextWeap = { btn: -2, isMouse: true }; // Mouse Wheel Down
	O.weap1 = { btn: 49 }; // 1
	O.weap2 = { btn: 50 }; // 2
	O.weap3 = { btn: 51 }; // 3
	O.weap4 = { btn: 52 }; // 4
	O.weap5 = { btn: 53 }; // 5
	O.weap6 = { btn: 54 }; // 6
	O.weap7 = { btn: 55 }; // 7
	O.weap8 = { btn: 56 }; // 8
	O.weap9 = { btn: 57 }; // 9
	O.weap0 = { btn: 48 }; // 0
};
CooMan.write = function(){
	var cookie = "";
	// we add an expiration date for the cookie
	var d = new Date();
	// the cookie should last for two month
    d.setTime(d.getTime() + ( 60 *24*60*60*1000));
    cookie += "expires="+d.toUTCString()+";";
	// for each option, we add it to the cookie
	for( var option in CooMan.options ){
		var opt = CooMan.options[option];
		var value;
		switch( typeof opt ){
			case "boolean" : value = "B"+opt; break;
			case "number"  : value = "N"+opt; break;
			case "string"  : value = "S"+opt; break;
			case "object"  :
				if( opt.value != null ){
					if(opt.isMouse) value = "M"+opt.value;
					else            value = "K"+opt.value;
				}
				break;
		}
		// we add the cookie if the value is set
		if(value != null) cookie += option+"="+value+";";
	}
	document.cookie = cookie;
};
CooMan.getLabelForKey = function(key){
	if( key ){ // if key is not null
		if( key.btn != null ){ // if the value of key is not null
			if( key.isMouse ){ // if it's a mouse button
				switch(key.btn){
					case  0 : return "Left Mouse";
					case  1 : return "Mouse Wheel";
					case  2 : return "Right Mouse";
					case  3 : return "Mouse Previous";
					case  4 : return "Mouse Next";
					// we use negative values because they are not used by any real button
					case -1 : return "Wheel Up";
					case -2 : return "Wheel Down";
				}
			}else{ // if it's a keyboard key
				switch(key.btn){
					case   8 : return "BACKSPACE";
					case   9 : return "TAB";
					case  13 : return "RETURN";
					case  14 : return "ENTER";
					case  16 : return "SHIFT";
					case  17 : return "CONTROL";
					case  18 : return "ALT";
					case  32 : return "SPACE";
					case  37 : return "LEFT";
					case  38 : return "UP";
					case  39 : return "RIGHT";
					case  40 : return "DOWN";
					case  48 : return "0"; // numkeys
					case  49 : return "1";
					case  50 : return "2";
					case  51 : return "3";
					case  52 : return "4";
					case  53 : return "5";
					case  54 : return "6";
					case  55 : return "7";
					case  56 : return "8";
					case  57 : return "9";
					case  59 : return ";"; // SEMICOLON
					case  61 : return "="; // EQUALS
					case  65 : return "A"; // alphabet
					case  66 : return "B";
					case  67 : return "C";
					case  68 : return "D";
					case  69 : return "E";
					case  70 : return "F";
					case  71 : return "G";
					case  72 : return "H";
					case  73 : return "I";
					case  74 : return "J";
					case  75 : return "K";
					case  76 : return "L";
					case  77 : return "M";
					case  78 : return "N";
					case  79 : return "O";
					case  80 : return "P";
					case  81 : return "Q";
					case  82 : return "R";
					case  83 : return "S";
					case  84 : return "T";
					case  85 : return "U";
					case  86 : return "V";
					case  87 : return "W";
					case  88 : return "X";
					case  89 : return "Y";
					case  90 : return "Z";
					case  96 : return "NUM0";
					case  97 : return "NUM1";
					case  98 : return "NUM2";
					case  99 : return "NUM3";
					case 100 : return "NUM4";
					case 101 : return "NUM5";
					case 102 : return "NUM6";
					case 103 : return "NUM7";
					case 104 : return "NUM8";
					case 105 : return "NUM9";
					case 106 : return "MULTIPLY";
					case 107 : return "ADD";
					case 108 : return "SEPARATOR";
					case 109 : return "SUBTRACT";
					case 110 : return "DECIMAL";
					case 111 : return "DIVIDE";
					case 112 : return "F1";
					case 113 : return "F2";
					case 114 : return "F3";
					case 115 : return "F4";
					case 116 : return "F5";
					case 117 : return "F6";
					case 118 : return "F7";
					case 119 : return "F8";
					case 120 : return "F9";
					case 121 : return "F10";
					case 122 : return "F11";
					//case 123 : return "F12"; // open console on chrome
					case 186 : return "$";
					case 187 : return "=";
					case 188 : return ",";
					case 190 : return ".";
					case 191 : return "/";
					case 192 : return "`";
					case 219 : return "[";
					case 220 : return "\\";
					case 221 : return "]";
					case 222 : return "\"";
				}
			}
		}
	}
	return "NONE";
};
