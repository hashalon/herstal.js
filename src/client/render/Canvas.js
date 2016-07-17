/**
Class to create a canvas, you should use only one for your web page
*/
function Canvas( id, resX, resY, worldRender, armsRender ){

	var div = document.body.getElementById(id);
	if(!div) throw new Error("the given id doesn't match any div of the document");

	// we create the renderer
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setSize( resX, resY );
	div.appendChild( this.renderer.domElement );

	this.worldRender = worldRender;
	this.armsRender  = armsRender;
}
// we add the class to the module
Canvas.prototype.constructor = HERSTAL.Canvas = Canvas;

/**
 * render the scene 60 times per second from the camera
 */
Canvas.prototype.renderUpdate = function(){

	// do stuff

	// first we render the world scene if it exist
	if(this.worldRender){
		if(this.worldRender.scene && this.worldRender.camera){
			this.renderer.render(this.worldRender.scene, this.worldRender.camera);
		}
	}
	// then we render the arms scene if it exists
	if(this.armsRender){
		if(this.armsRender.scene && this.armsRender.camera){
			this.renderer.render(this.armsRender.scene, this.armsRender.camera);
		}
	}
};
