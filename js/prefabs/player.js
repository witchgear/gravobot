//Player constructor function
function Player(game, x, y, key, frame) //maybe add more paramaters as needed
{
	//call Phaser.Sprite from this object
	//call(object to call function in, game object, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	//enable physics & physics settings
	game.physics.arcade.enable(this);
	this.collideWorldBounds = true;
	player.body.gravity.y = 2500;
}

//link the player object's prototype to the Phaser.Sprite object
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//player object's individual update loop
Player.prototype.update = function()
{
	
}