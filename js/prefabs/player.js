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
	this.jumpSpeed = -400;
	
	this.canWalk = true;
	this.canJump = true;
	this.isCrouching = false;
	this.isJumping = false;
	
	this.objectStandingOn = null; //reference to the object the player is standing on
	this.relativeX = 0; //x location relative to object being stood on
	this.relativeY = 0; //y
	
	this.onBox = false; //whether the player is colliding with a box
	this.onPlatform = false; //whether the player is colliding with a platform
	this.onGround = false; //whether the player is colliding with the ground
		
	//set anchor
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	
	//enable physics & physics settings
	game.physics.arcade.enable(this);	
	this.body.collideWorldBounds = true;
	this.body.gravity.y = worldGravity;
	
	//set player collision box
	this.body.setSize(48, 124, 24, 4);
}

//link the player object's prototype to the Phaser.Sprite object
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

//player object's individual update loop
Player.prototype.update = function()
{
	//reset velocity every frame
	this.body.velocity.x = 0;
	
	//handle movement if the player can walk
	if(this.canWalk)
	{
		this.handleMovement(this);
	}
	
	//handle jump if the player can jump
	if(this.canJump)
	{
		this.handleJump(this);
	}
	
	//handle crouch
	this.handleCrouch(this);
	
	// if the player somehow clips through the floor
	if(this.body.y > this.game.height){ 
		this.body.x = game.camera.x + Math.abs(this.width) ; // put them back at the beginning of the area
		this.body.y = game.camera.y - this.height ;
	}

	// if the player is being hit by a box while touching the ground
	if(this.onBox && this.onGround && this.body.touching.up) {
		this.body.immovable = true ; // temporarily make them immovable so the box doesn't push them into the floor
	}
	else {
		this.body.immovable = false ; // otherwise the player is immovable
	}
	
	// update the camera
	//updateCamera(this, this.game) ;
}

Player.prototype.handleMovement = function(player)
{
	//walk left if holding A
	if(A.isDown)
	{
		player.body.velocity.x += -player.walkSpeed;
		player.animations.play('walk') ; // play walk animation
		player.scale.x = -1 ; // flip sprite so it faces left
	}
	//walk right if holding D
	else if(D.isDown)
	{
		player.body.velocity.x += player.walkSpeed;
		player.animations.play('walk') ; // play walk animation
		player.scale.x = 1 ; // make sure sprite is facing right
	}
	else if(!this.isCrouching) // if player is not moving horizontally && not crouching
	{
		player.animations.play('idle') ; // play idle animation
	}
}

Player.prototype.handleJump = function(player)
{
	if(player.isJumping == false && (SPACEBAR.justPressed() || W.justPressed()))
	{
		player.isJumping = player;
		player.body.velocity.y += player.jumpSpeed;
		player.onBox = false;
		player.onPlatform = false;
	}
	//not jumping if velocity 0 (standing on floor) or standing on box or platform
	if(player.isJumping && (player.body.velocity.y == 0 || ((player.onBox || player.onPlatform)
	&& player.body.touching.down)))
	{
		player.isJumping = false;
	}
}

//handles crouch, allowing player to stick to a box/platform while they're standing on it
Player.prototype.handleCrouch = function(player)
{
	//S was pressed down && the player is standing on something
	if(!player.isCrouching && S.isDown && player.body.touching.down 
	&& player.objectStandingOn != null)
	{
		//set isCrouching to true
		player.isCrouching = true;
		
		//save the player's position relative to the object
		player.relativeX = player.body.x - player.objectStandingOn.body.x;
		player.relativeY = player.body.y - player.objectStandingOn.body.y;
		
		//disable gravity, jumping, and walking
		player.body.gravity.y = 0;
		player.canJump = false;
		player.canWalk = false;
		
		//play crouch animation
		//player.animations.play('crouch'); uncomment when there is an animation
	}
	
	//player is crouching
	if(player.isCrouching)
	{
		//move the player to the object's location + offset
		player.body.x = player.objectStandingOn.body.x + player.relativeX;
		player.body.y = player.objectStandingOn.body.y + player.relativeY;
		
		//reset offset in case player flies off
		player.relativeX = player.body.x - player.objectStandingOn.body.x;
		player.relativeY = player.body.y - player.objectStandingOn.body.y;
	}
	
	//S was released or no longer standing on anything
	if(player.isCrouching && S.justReleased())
	{
		//set isCrouching to false
		player.isCrouching = false;
		
		//re-enable gravity, jumping, and walking
		player.body.velocity.y = 0; //reset velocity so gravobot doesn't fly upward 
		player.body.gravity.y = worldGravity;
		player.canJump = true;
		player.canWalk = true;
		
		//reset animation to idle
		player.animations.play('idle');
		
		//reset pointer for objectStandingOn
		player.objectStandingOn = null;
	}
}

//saves a pointer to the object the player is standing on
Player.prototype.saveObject = function(player, object)
{
	//if standing on the object and not colliding from side
	if(player.body.touching.down)
	{
		//set pointer
		player.objectStandingOn = object;
	}
}

// update the game camera depending on the player's position
// moves by snapping to the next area when the player begins to go off-screen
updateCamera = function(player, game, gravityball)
{
	// console.log('updating Camera') ;
	// if the player is to the right of the camera's position plus the game width
	if(player.position.x > (game.camera.position.x + game.width)) {
		game.camera.x += game.width ; // move the camera to the right by the game's width
		returnGravityBall(game, player, gravityball) ; // return the gravity ball
	}
	// if the player is to the left of the camera
	else if(player.position.x < game.camera.position.x) {
		game.camera.x -= game.width ; // move the camera to the left by the game's width
		returnGravityBall(game, player, gravityball) ; // return the gravity ball
	}
}