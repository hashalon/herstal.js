function getLabelForKey(key){
	if( key ){ // if key is not null
		if( key.btn != null ){ // if the value of key is not null
			if( key.isMouse ){ // if it's a mouse button
				switch(key.btn){
					case  0 : return "Left Mouse";
					case  1 : return "Mouse Wheel";
					case  2 : return "Right Mouse";
					case  3 : return "Mouse Previous";
					case  4 : return "Mouse Next";
					// we use negative values because
					// they are not used by any real button
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
}

function initForm(){
	// we need to read user preferences
	if(window.HERSTALprefs){
		// initialize the value of each button
		for( var index in HERSTALprefs.preferences ){
			var option = HERSTALprefs.preferences[index];
			var line = document.getElementById(index);
			if(line){
				var input = line.getElementsByClassName("hrs-input")[0];
				if(input){
					if(typeof option === "object"){ // {btn: keyCode}
						// we display the name of the key
						// instead of it's keycode
						input.value = getLabelForKey(option);
						input.data  = option;
					}else if(input.type === "checkbox"){ // boolean
						// only the presence of the property matters
						if(option) input.checked = true;
						else delete input.checked;
					}else{ // text field, etc...
						input.value = option;
					}
				}
			}
		}
	}
}
// we initialize the form once
initForm();

function resetPreferences(){
	var lang = navigator.language || navigator.languages[0];
	lang = lang.substr(0,2); // only first two characters
	HERSTALprefs.reset(lang);
	initForm();
	// we need to update the jscolor inputs
	var jscolorInputs = document.getElementsByClassName("jscolor");
	for(var i=0; i<jscolorInputs.length; ++i){
		var input = jscolorInputs[i];
		// force the jscolor input to update
		input.focus();
		input.blur();
	}
}

function savePreferences(){
	var prefs = HERSTALprefs.preferences;
	for( var index in prefs ){
		// we recover the input line
		var line = document.getElementById(index);
		if(line && typeof prefs[index] !== "object"){
			var input = line.getElementsByClassName("hrs-input")[0];
			if(input){
				if(input.data){
					prefs[index] = input.data;
				}else if(input.type === "checkbox"){
					prefs[index] = input.checked !== "undefined";
				}else{
					prefs[index] = input.value;
				}
			}
		}
	}
	// if we can save, we save the preferences of the user
	if(window.HERSTALprefs) HERSTALprefs.save();
}

// keep track of the message that ask the user to enter a key input
var change_input = {
	msg : document.getElementById("change-input-msg"),
	bg  : document.getElementById("change-input-bg"),
	isVisible : false,
	// display the message or hide it
	setVisible : function(visible){
		var display = visible ? "block" : "none";
		this.msg.style.display = display;
		this.bg .style.display = display;
		this.isVisible = visible;
	},
	// set the input label to display
	setText : function(text){
		var input = this.msg.getElementsByTagName("b")[0];
		input.innerHTML = text;
	}
};
// the user hasn't clicked on a button yet, we hide the message
change_input.setVisible(false);
// when the user click on a button to edit an input
var currentInput = null; // hold the input we are currently editing
var onBtnPressed = function(btn){
	change_input.setVisible(true);
	currentInput = btn.parentElement.parentElement;
	change_input.setText(currentInput.
		getElementsByClassName("hrs-label")[0].innerText);
};
var eventHandler = function(e){
	// as long as the message asking for a key input is visible
	if(change_input.isVisible && currentInput){
		e = e || window.event;
		var keyData;

		if(e.wheelDelta || e.deltaY){ // if it's the mouse wheel
			// we recover the delta of the mouse wheel
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY)));
			// if delta is not null or zero
			// -1 is up, -2 is down
			if(delta) keyData = {btn: (delta > 0) ? -1 : -2, isMouse: true};

		}else if(e.button != null){ // if it's a mouse button
			keyData = {btn: e.button, isMouse: true};

		}else if(e.which || e.keyCode){ // if it's a keyboard key
			var keyCode = (typeof e.which == "number") ? e.which : e.keyCode;
			switch(keyCode){
				case 27 :  // if ESC, we cancel
					// we can hide the message
					change_input.setVisible(false);
					currentInput = null;
					return null;
				case 46 : break; // if DEL, input will be NONE
				default : keyData = {btn: keyCode};
			}
		}
		// we update the value displayed in the button
		var input = currentInput.getElementsByClassName("hrs-input")[0];
		if(input){
			input.value = getLabelForKey(keyData);
			input.data = keyData;
		}
	}
	// we can hide the message
	change_input.setVisible(false);
	currentInput = null;
};
// use listener instead of onkeydown for compatibility with firefox
document.addEventListener('mousedown', eventHandler, false);
document.addEventListener('keydown'  , eventHandler, false);
document.addEventListener('wheel'    , eventHandler, false);
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);
