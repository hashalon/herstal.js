// initialize the value of each button
for( var option in CooMan.options ){
	var input = CooMan.options[option];
	var value;
	if( typeof input == "object" ) value = CooMan.getLabelForKey(input);
	else value = input;
	var line = document.getElementById(option);
	if(line){
		var btn = line.getElementsByClassName("key-input")[0];
		if(btn){
			// if it's not a checkbox, we just assign the value
			if(btn.type != "checkbox") btn.value = value;
			// if it's a checkbox, we need to add a checked attribute
			else if(value) btn.checked = true;
		} //else console.log("btn : "+option);
	} //else console.log("line : "+option);
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
	change_input.setText(currentInput.getElementsByClassName("key-label")[0].innerText);
};
var eventHandler = function(e){
	// when we have assigned the key, we hide the message
	var end = function(){
		// we can hide the message
		change_input.setVisible(false);
		currentInput = null;
		return;
	};
	// as long as the message asking for a key input is visible
	if(change_input.isVisible && currentInput){
		e = e || window.event;
		var input;
		if(e.wheelDelta || e.deltaY){ // if it's the mouse wheel
			// we recover the delta of the mouse wheel
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY)));
			// if delta is not null or zero
			// -1 is up, -2 is down
			if(delta) input = {value: (delta > 0) ? -1 : -2, isMouse: true};

		}else if(e.button != null){ // if it's a mouse button
			input = {value: e.button, isMouse: true};

		}else if(e.which || e.keyCode){ // if it's a keyboard key
			var keyCode = (typeof e.which == "number") ? e.which : e.keyCode;
			switch(keyCode){
				case 27 : end(); // if ESC, we cancel
				case 46 : break; // if DEL, input will be NONE
				default : input = {value: keyCode};
			}
		}
		CooMan.options[currentInput.id] = input; // we update the preferences
		// we update the value displayed in the button
		var btn = currentInput.getElementsByClassName("key-input")[0];
		btn.value = CooMan.getLabelForKey(input);
	}
	end();
};
// use listener instead of onkeydown for compatibility with firefox
document.addEventListener('mousedown', eventHandler, false);
document.addEventListener('keydown'  , eventHandler, false);
document.addEventListener('wheel'    , eventHandler, false);
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

var savePreferences = function(){
	// we save the user preferences in a cookie
	CooMan.write();
	console.log("cookie saved");
};
