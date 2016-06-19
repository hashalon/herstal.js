'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {
  var HERSTALclient = {};

  if (!window || !document) throw new Error("This librairy is meant to be used in a web browser");

  window.HERSTALclient = HERSTALclient;

  if (!io) throw new Error('Herstal.client needs Socket.io to work');
  if (!CooMan) throw new Error('Herstal.client needs CookieManager to work');
  if (!HERSTALshared) throw new Error('Herstal.client needs Herstal.shared to work');

  /**
   * Class to manage characters appearance and animations
   */
  function CharacterModel(character, options) {
    options = options || {};

    // the worldRender of the model
    this.worldRender = null;
    this.character = character;

    this.character.characterModel = this;

    this.geometry = null;
    this.material = null;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
  // we add the class to the module
  HERSTALclient.CharacterModel = CharacterModel;
  CharacterModel.prototype.constructor = CharacterModel;

  CharacterModel.prototype.animate = function (animation) {};

  /**
   * This class represent the current player
   */
  function CurrentPlayer(player) {

    // the regular data regarding the player
    this.player = player;
    this.waitInput = false;

    // use listener instead of onkeydown for compatibility with firefox
    document.addEventListener('mousedown', this.eventHandler, false);
    document.addEventListener('keydown', this.eventHandler, false);
    document.addEventListener('wheel', this.eventHandler, false);
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    }, false);
  }
  // we add the class to the module
  HERSTALclient.CurrentPlayer = CurrentPlayer;
  CurrentPlayer.prototype.constructor = CurrentPlayer;

  /**
   * Handle event such as keypress and mouse button and store the result
   * in the inputs of the character if present
   */
  CurrentPlayer.prototype.eventHandler = function (e) {
    // if we are waiting for a new input and we have a character associated
    if (this.waitInput && this.player.character) {
      // we recover the event
      e = e || window.event;

      var btn = null,
          isMouse = false;
      if (e.wheelDelta || e.deltaY) {
        // mouse wheel
        // we recover the delta of the mouse wheel
        var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY));
        // if delta is not null or zero
        // -1 is up, -2 is down
        if (delta) {
          btn = delta > 0 ? -1 : -2;
          isMouse = true;
        }
      } else if (e.button !== null) {
        // mouse button
        btn = e.button;
        isMouse = true;
      } else if (e.which || e.keyCode) {
        // keyboard key
        btn = typeof e.which == "number" ? e.which : e.keyCode;
      }

      // if our event match a key or mouse input
      if (btn !== null) {
        // we recover the action this button activate
        var tag = isMouse ? CurrentPlayer.INPUTS.mouse[btn] : CurrentPlayer.INPUTS.keyboard[btn];

        // we create a new object to store our inputs
        var inputs = this.player.character.inputs = {};
        inputs.movement = { x: 0, y: 0 };
        inputs.weapon = null;
        // some action have a specific behavior
        // if the tag begin with weap
        if (tag.substr(0, 4) == "weap") {
          // we just recover the number of the weapon
          inputs.weapon = tag.substr(4, 1);
        } else switch (tag) {
          // movement inputs
          case "moveF":
            ++inputs.movement.y;break;
          case "moveB":
            --inputs.movement.y;break;
          case "moveL":
            --inputs.movement.x;break;
          case "moveR":
            ++inputs.movement.x;break;
          // weapon management bis
          case "prevWeap":
            inputs.weapon = -1;break;
          case "nextWeap":
            inputs.weapon = -2;break;
          // if we haven't specified a special rule, than we are just pressing the input
          default:
            inputs[tag] = true;
        }
      }
    }
  };

  // we store the inputs the following way:
  // keyvalue => action
  CurrentPlayer.INPUTS = {
    mouse: {},
    keyboard: {}
  };
  // we fill the INPUTS with the content of CooMan
  for (var id in CooMan.options) {
    var option = CooMan.options[id];
    // if the options is an object
    if ((typeof option === 'undefined' ? 'undefined' : _typeof(option)) === "object") {
      // if the object as a btn attribute
      if (option.btn !== null) {
        // if it as a isMouse attribute set to true
        if (option.isMouse) CurrentPlayer.INPUTS.mouse[option.btn] = id;else CurrentPlayer.INPUTS.keyboard[option.btn] = id;
      }
    }
  }

  /**
   * Allow us to manage connections between client and server
   */
  function Client(address) {

    // we create a socket that will allow us to communicate with the server
    this.socket = io.connect(address);
  }
  // we add the class to the module
  HERSTALclient.Client = Client;
  Client.prototype.constructor = Client;

  /**
   * Class to create a canvas, you should use only one for your web page
   */
  function Canvas(id, resX, resY, worldRender, armsRender) {

    var div = document.body.getElementById(id);
    if (!div) throw new Error("the given id doesn't match any div of the document");

    // we create the renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(resX, resY);
    div.appendChild(this.renderer.domElement);

    this.worldRender = worldRender;
    this.armsRender = armsRender;
  }
  // we add the class to the module
  HERSTALclient.Canvas = Canvas;
  Canvas.prototype.constructor = Canvas;

  /**
   * render the scene 60 times per second from the camera
   */
  Canvas.prototype.renderUpdate = function () {

    // do stuff

    // first we render the world scene if it exist
    if (this.worldRender) {
      if (this.worldRender.scene && this.worldRender.camera) {
        this.renderer.render(this.worldRender.scene, this.worldRender.camera);
      }
    }
    // then we render the arms scene if it exists
    if (this.armsRender) {
      if (this.armsRender.scene && this.armsRender.camera) {
        this.renderer.render(this.armsRender.scene, this.armsRender.camera);
      }
    }
  };

  /**
   * Class to render the world based on the HERSTALshared world
   * @param {HERSTALshared.World} world - the world to render
   * @param {THREE.Camera} camera - the camera from where to render the world, can be null
   */
  function WorldRender(world, camera) {
    this.world = world;
    this.camera = camera;

    this.scene = new THREE.Scene();

    this.characterModels = [];
  }
  HERSTALclient.WorldRender = WorldRender;
  WorldRender.prototype.constructor = WorldRender;

  WorldRender.prototype.addCharacterModel = function (characterModel) {
    // since we are in a web browser, we can use the method addElement defined in HERSTALshared
    this.characterModels.addElement(characterModel);
    // the characterModel shoudl in which world it is
    characterModel.worldRender = this;
    // we add the model itself to the scene
    this.scene.add(characterModel.mesh);
  };

  WorldRender.prototype.removeCharacterModel = function (characterModel) {
    var index = this.characterModels.removeElement(characterModel);
    // if the character was in the array
    if (index > -1) {
      characterModel.worldRender = null;
      this.scene.remove(characterModel.mesh);
    }
  };
})();