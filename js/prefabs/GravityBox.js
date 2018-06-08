//Gravity Box constructor function
function GravityBox(game, x, y, key, frame)
{
	//call Phaser.Sprite from this object
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	//add object properties
	this.influenced = false;
	this.direction = "omni"; //direction box can move, do not change
	this.floating = false;
	this.floatSpeed = -20;
	this.floatGravity = 60;
	this.floatDelay = 900 //in ms
	
	//set anchor
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	
	//enable physics & physics settings
	game.physics.arcade.enable(this);	
	this.body.collideWorldBounds = true;
	this.body.gravity.y = worldGravity;
	this.body.immovable = true; //prevents gravity box from being pushed by player
	
	this.originalX = x;
	
	//create timer
	this.timer = game.time.create();
}

//link the object's prototype to the Phaser.Sprite object
GravityBox.prototype = Object.create(Phaser.Sprite.prototype);
GravityBox.prototype.constructor = GravityBox;

GravityBox.prototype.update = function()
{
	//only update if the object is on screen to reduce lag
	if(!offCamera(this, 100))
	{
		//unset immovable if being influenced, otherwise box will pass through the gravity ball
		if(this.influenced)
		{
			this.body.immovable = false;
			this.floating = false;
		}
		else
		{
			this.body.immovable = true;
		}
		
		this.handleFloating();
		
		this.respawn();
		
		this.body.velocity.x = 0; //reset velocity every frame
	}
}

GravityBox.prototype.respawn = function()
{
	//if the box clips through the ground
	if(this.body.y > this.game.height)
	{ 
		this.body.x = this.originalX; // put them back at the beginning of the area
		this.body.y = game.camera.y - this.height ;
	}
}

GravityBox.prototype.handleFloating = function()
{
	//make the box bounce to create floating effect
	if(this.floating && !this.influenced)
	{
		//if the timer is not already running
		if(!this.timer.running)
		{
			//add the looping event and start the timer
			this.timer.loop(this.floatDelay, this.floatUp, this);
			this.timer.start();
			
			//set gravity
			this.body.velocity.y = this.floatSpeed;
			this.body.gravity.y = this.floatGravity;
		}
	}
	else if(!this.floating)
	{
		//if timer is running, stop timer
		if(this.timer.running)
		{
			//remove the event and stop the timer
			this.timer.stop(true);
			
			//reset gravity
			this.body.gravity.y = worldGravity;
		}
	}
}

GravityBox.prototype.floatUp = function()
{
	this.body.velocity.y = this.floatSpeed;
}