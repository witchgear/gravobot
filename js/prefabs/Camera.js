//Camera constructor function
function Camera(game, player, x, y)
{
	//call Phaser.Camera from this object
	//call(object to call function in, game object, x, y, width, height)
	//Phaser.Camera.call(this, game, x, y, game.width, game.height);
	this.camera = game.camera ;
	this.player = player ;
	
}

//link the camera object's prototype to the Phaser.Camera object
Camera.prototype = Object.create(Phaser.Camera.prototype);
Camera.prototype.constructor = Camera;

//camera object's individual update loop
Camera.prototype.update = function()
{
	//update the camera when the player moves off screen
	if(this.offCamera(this.player, 0) == "right") 
	{
		this.position.x += game.width;
	}
	else if(this.offCamera(this.player, 0) == "left") 
	{
		this.position.x -= game.width;
	}
}

//checks if an object is on camera
Camera.prototype.offCamera = function(obj, leniency)
{
	//if the object is off the right side of the camera
	if(obj.body.x > (this.camera.position.x + game.width + leniency))
	{
		return "right";
	}
	else if(obj.body.x < (this.camera.position.x - leniency)) //else off the left side
	{
		return "left";
	}
	else //the object is on camera
	{
		return false;
	}
}