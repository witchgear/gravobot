//swing constructor function
function Swing(game, x, y, key, platform)
{
	//call Phaser.Sprite from this object
	Phaser.Sprite.call(this, game, x, y, key);
	
	//set anchor
	this.anchor.x = 0.5
	
	//store reference to attached platform
	this.platform = platform;
	
	//enable physics & physics settings
	game.physics.arcade.enable(this);
	
	//set collision box to the end of the swing
	//this.body.setSize(8, 8, 0, 392);
}

//link the object's prototype to the Phaser.Sprite object
Swing.prototype = Object.create(Phaser.Sprite.prototype);
Swing.prototype.constructor = Swing;

Swing.prototype.update = function()
{
	//if not being influenced
	if(!this.platform.influenced)
	{
		if(this.body.rotation < 0)
		{
			this.body.angularAcceleration = 60;
		}			
		else if(this.body.rotation > 0)
		{
			this.body.angularAcceleration = -60;
		}
		
	}

	//move the platform to the end of the swing each frame
	this.platform.body.x = this.x - this.height * Math.sin(this.rotation) - this.platform.body.width / 2;
	this.platform.body.y = this.y + this.height * Math.cos(this.rotation) - this.platform.body.height / 2 + 4;
}

//when influenced, angular velocity everything is angular velocity
//between 180 (leftmost) and 0 (rightmost)
//90 is resting