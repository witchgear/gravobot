//Player constructor function
function Camera(game, player, x, y)
{
	//call Phaser.Camera from this object
	//call(object to call function in, game object, x, y, width, height)
	//Phaser.Camera.call(this, game, x, y, game.width, game.height);
	this.camera = game.camera ;
	this.player = player ;
	
}

//link the player object's prototype to the Phaser.Camera object
Camera.prototype = Object.create(Phaser.Camera.prototype);
Camera.prototype.constructor = Camera;

//player object's individual update loop
Camera.prototype.update = function()
{
	if(this.player.body.x > (this.camera.position.x + game.width)) {
		this.position.x += game.width ;
	}
	else if(this.player.body.x < this.camera.position.x) {
		this.position.x -= game.width ;
	}
}