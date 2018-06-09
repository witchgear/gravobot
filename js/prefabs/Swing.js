//swing constructor function
function Swing(game, x, y, key, platform)
{
	//call Phaser.Sprite from this object
	Phaser.Sprite.call(this, game, x, y, key);
	
	//set anchor
	this.anchor.x = 0.5
	
	//store reference to attached platform
	this.platform = platform;
	
	//number of times the swing has reached maximum height
	this.numMax = 0;
	
	//enable physics & physics settings
	game.physics.arcade.enable(this);
	
	//set collision box to the end of the swing
	this.body.setSize(8, 8, 0, 392);
}

//link the object's prototype to the Phaser.Sprite object
Swing.prototype = Object.create(Phaser.Sprite.prototype);
Swing.prototype.constructor = Swing;

Swing.prototype.update = function()
{
	//move the platform to the end of the swing each frame
	this.platform.x = this.x - this.height * Math.sin(this.rotation);
	this.platform.y = this.y + this.height * Math.cos(this.rotation);
	
	//if not being influenced
	if(!this.platform.influenced)
	{
		//if swinging counterclockwise
		if(this.body.rotation < 0)
		{
			//gravity in the other direction
			this.body.angularAcceleration = 60;
		}		
		//else if swinging clockwise
		else if(this.body.rotation > 0)
		{
			//gravity in the other direction
			this.body.angularAcceleration = -60;
		}
		
		//swinging too far
		if(this.body.rotation < -90 || this.body.rotation > 90)
		{
			//reset velocity
			this.body.angularVelocity = 0;
		}
		
		//if the angular velocity is 0, meaning the swing is at maximum height
		if(this.body.angularVelocity == 0)
		{
			this.numMax++;
		}
		
		//if the swing has reached maximum 4 times and is at resting position
		if(this.body.rotation < 3 && this.body.rotation > -3 && this.numMax >= 4)
		{
			this.numMax = 0; //reset numMax
			
			//reset angular movement, otherwise the swing will swing forever
			this.body.rotation = 0;
			this.body.angularVelocity = 0;
			this.body.angularAcceleration = 0;
		}
	}
	else
	{
		//reset numMax if being influenced
		if(this.numMax != 0)
		{
			this.numMax = 0; 
		}
	}
}	