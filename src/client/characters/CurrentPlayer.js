/**
The current player for this game's client
@class CurrentPlayer
*/
class CurrentPlayer {
  /**
	@constructor
	@param {Number} id The id of the player
	@param {String} name The name of the player
	@param {Object} options Configuration of the player
	*/
  constructor(id, options){
    options = options || {};

    // the id of the player has given by the server
    this.id = id;
    // the character of the player
    this.character = null;

    this.waitInput = false;

    // use listener instead of onkeydown for compatibility with firefox
    document.addEventListener('mousedown', this.eventHandler, false);
    document.addEventListener('keydown'  , this.eventHandler, false);
    document.addEventListener('wheel'    , this.eventHandler, false);
    document.addEventListener("contextmenu", function(e){
      e.preventDefault();
    }, false);
  }

  /**
  Handle event such as keypress and mouse button and store the result
  in the inputs of the character if present
  */
  eventHandler(e){
    // if we are waiting for a new input and we have a character associated
    if(this.waitInput && this.player.character){
      // we recover the event
      e = e || window.event;

      var btn = null, isMouse = false;
      if(e.wheelDelta || e.deltaY){ // mouse wheel
        // we recover the delta of the mouse wheel
      	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.deltaY)));
      	// if delta is not null or zero
      	// -1 is up, -2 is down
      	if(delta){
          btn = (delta > 0) ? -1 : -2;
          isMouse = true;
        }
      }else if(e.button != null){ // mouse button
        btn = e.button;
        isMouse = true;
      }else if(e.which || e.keyCode){ // keyboard key
        btn = (typeof e.which == "number") ? e.which : e.keyCode;
      }

      // if our event match a key or mouse input
      if(btn != null){
        // we recover the action this button activate
        var tag = isMouse ?
          CurrentPlayer.INPUTS.mouse   [btn] :
          CurrentPlayer.INPUTS.keyboard[btn] ;

        // we create a new object to store our inputs
        var inputs = this.character.inputs = {};
        inputs.movement = { x:0, y:0 };
        inputs.weapon = null;
        // some action have a specific behavior
        // if the tag begin with weap
        if( tag.substr(0,4) == "weap" ){
          // we just recover the number of the weapon
          inputs.weapon = tag.substr(4,1);
        }else switch(tag){
          // movement inputs
          case "moveF": ++inputs.movement.y; break;
          case "moveB": --inputs.movement.y; break;
          case "moveL": --inputs.movement.x; break;
          case "moveR": ++inputs.movement.x; break;
          // weapon management bis
          case "prevWeap": inputs.weapon = -1; break;
          case "nextWeap": inputs.weapon = -2; break;
          // if we haven't specified a special rule,
          // than we are just pressing the input
          default: inputs[tag] = true;
        }
      }
    }
  }
}
HERSTAL.CurrentPlayer = CurrentPlayer;

// we store the inputs the following way:
// keyvalue => action
CurrentPlayer.INPUTS = {
  mouse: {},
  keyboard: {}
};
// we fill the INPUTS with the content of the player preferences
for( var id in HERSTAL.CONFIG.preferences ){
  var pref = HERSTAL.CONFIG.preferences[id];
  // if the preference is an object
  if(typeof pref === "object"){
    // if the object as a btn attribute
    if(pref.btn != null){
      // if it as a isMouse attribute set to true
      if(pref.isMouse) CurrentPlayer.INPUTS.mouse   [pref.btn] = id;
      else             CurrentPlayer.INPUTS.keyboard[pref.btn] = id;
    }
  }
}
