//Player constructor function
function Player(game, x, y, key, frame)
{
	//call Phaser.Sprite from this object
	//call(object to call function in, game object, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);

	// store pointer to game object
	this.game = game ;
	
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

	// update the camera
	updateCamera(this, this.game) ;
}

// update the game camera depending on the player's position
// moves by snapping to the next area when the player begins to go off-screen
updateCamera = function(player, game)
{
	// if the player is to the right of the camera's position plus the game width
	if(player.position.x > (game.camera.position.x + game.width)) {
		game.camera.x += game.width ; // move the camera to the right by the game's width
	}
	// if the player is to the left of the camera
	else if(player.position.x < game.camera.position.x) {
		game.camera.x -= game.width ; // move the camera to the left by the game's width
	}
}