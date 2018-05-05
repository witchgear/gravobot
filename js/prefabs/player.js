//Player constructor function
function Player(game, x, y, key, frame) //maybe add more paramaters as needed
{
	//call Phaser.Sprite from this object
	//call(object to call function in, game object, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	//add player properties
	this.walkSpeed = 200;
	this.jumpSpeed = -450;
	this.isJumping = false;
	this.influenced = false;
		
	//increase player scale and set anchor
	this.scale.setTo(2, 2);
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	
	//enable physics & physics settings
	game.physics.arcade.enable(this);	
	this.body.collideWorldBounds = true;
	this.body.gravity.y = worldGravity;
	
	//set player collision box
	this.body.setSize(48, 66, 0, 0);
}

//link the player object's prototype to the Phaser.Sprite object
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//player object's individual update loop
Player.prototype.update = function()
{
	//handle movement
	this.body.velocity.x = 0;
	if(A.isDown)
	{
		this.body.velocity.x += -this.walkSpeed;
	}
	if(D.isDown)
	{
		this.body.velocity.x += this.walkSpeed;
	}
	
	//handle jump
	if(this.isJumping == false && (SPACEBAR.justPressed() || W.justPressed()))
	{
		this.isJumping = true;
		this.body.velocity.y += this.jumpSpeed;
	}
	//not jumping if velocity 0
	if(this.isJumping && this.body.velocity.y == 0)
	{
		this.isJumping = false;
	}
}