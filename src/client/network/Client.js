/**
Allow us to manage connections between client and server
*/
var CLIENT = HERSTAL.CLIENT = {
	init: function(address){
		this.socket = io.connect(address);
	},
};
