//Platform constructor function
function Platform(game, x, y, key, frame, direction, limitA, limitB)
{
	//call Phaser.Sprite from this object
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	//add object properties
	this.influenced = false;
	
	//the direction that the platform can move, only set to "horizontal", "vertical", or "swing"
	this.direction = direction; 
	
	//limitA should always < limitB
	this.limitA = limitA; //the leftmost or upper limit of the platform's movement
	this.limitB = limitB; //the rightmost or lower limit of the platform's movement
		
	//set anchor
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	
	//enable physics & physics settings
	game.physics.arcade.enable(this);
	this.body.gravity.x = 0;
	this.body.gravity.y = 0;
	this.body.immovable = true; //prevents platform from being pushed by player
	
	//if this. is a swing platform
	if(this.direction == "swing")
	{
		this.body.allowGravity = false; //disable gravity, platform will sink if not disabled
	}
	
	//set collision box
	//this.body.setSize(44, 46, 2, 2);
}

//link the object's prototype to the Phaser.Sprite object
Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function()
{
	if(this.direction == "horizontal")
	{
		this.body.velocity.x = 0; //reset velocity every frame
	}
	else if(this.direction == "vertical")
	{
		this.body.velocity.y = 0; //reset velocity every frame
	}
}

Platform.prototype.saveSwingPointer = function(swing)
{
	this.swing = swing;
}