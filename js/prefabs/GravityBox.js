//Player constructor function
function GravityBox(game, x, y, key)
{
	//call Phaser.Sprite from this object
	Phaser.Sprite.call(this, game, x, y, key);
	
	//add object properties
	this.influenced = false;
		
	//set anchor
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	
	//enable physics & physics settings
	game.physics.arcade.enable(this);	
	this.body.collideWorldBounds = true;
	this.body.gravity.y = worldGravity;
	this.body.immovable = true; //prevents gravity box from being pushed by player
	
	//set collision box
	this.body.setSize(44, 46, 2, 2);
}

//link the object's prototype to the Phaser.Sprite object
GravityBox.prototype = Object.create(Phaser.Sprite.prototype);
GravityBox.prototype.constructor = GravityBox;

GravityBox.prototype.update = function()
{
	//unset immovable if being influenced, otherwise box will pass through the gravity ball
	if(this.influenced)
	{
		this.body.immovable = false;
	}
	else
	{
		this.body.immovable = true;
	}
	
	this.body.velocity.x = 0; //reset velocity every frame
}