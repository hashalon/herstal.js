/**
 * main object to manage connections
 */
function Server(name, port, maxPlayers, maps, modes){

	this.name = typeof name === "string" ? name : "unnamed server";
	this.port = port > 0 ? port : 8080;
	this.maxPlayers = maxPlayers > 0 ? maxPlayers : 8;

	// if maps is a array
	this.maps = ["base"];
	if( typeof maps === "object" ){
		// if the array is not empty
		if(maps.length > 0) this.maps = maps;
	}
	// if modes is a array
	this.modes = ["default"];
	if( typeof modes === "object" ){
		// if the array is not empty
		if(modes.length > 0) this.modes = modes;
	}

	var server = HTTP.createServer(function(req, res){

	});
	var io = SOCKETIO.listen(server);

	io.sockets.on('connection', function(socket){
		console.log();
	});

	server.listen(port);

}
// we add the class to the module
HERSTALserver.Server = Server;
Server.prototype.constructor = Server;
