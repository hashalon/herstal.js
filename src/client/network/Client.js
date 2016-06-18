/**
 * Allow us to manage connections between client and server
 */
function Client( address ){

	// we create a socket that will allow us to communicate with the server
	this.socket = io.connect(address);
}
// we add the class to the module
HERSTALclient.Client = Client;
Client.prototype.constructor = Client;
