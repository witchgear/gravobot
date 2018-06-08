//this object represents the circle of influence on gravity that the gravity ball exerts
//constructor function
function GravityInfluence(game, key, gravityBall, boxes, platforms)
{
	//call Phaser.Sprite from this object
	Phaser.Sprite.call(this, game, 0, 0, key);
	
	//store references to objects
	this.gravityBall = gravityBall;
	this.boxes = boxes;
	this.platforms = platforms;
	
	//set the strength of the gravity that the ball exerts
	this.strengthX = 20000;
	this.strengthY = 2000;
	this.strengthAngular = 60; //in degrees
	
	//set anchor and alpha
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.alpha = 0;
	
	//enable physics and physics settings
	game.physics.arcade.enable(this);	
		
	//sets collision circle of influence with given radius
	this.body.setCircle(256);
}

//link the gravity influence object's prototype to the Phaser.Sprite object
GravityInfluence.prototype = Object.create(Phaser.Sprite.prototype);
GravityInfluence.prototype.constructor = GravityInfluence;

GravityInfluence.prototype.update = function()
{
	//update position of influence so it is always attached to the gravity ball
	this.body.x = this.gravityBall.body.x - 220;
	this.body.y = this.gravityBall.body.y - 220;
	
	//if the ball is activated
	if(this.gravityBall.activated)
	{
		//set the alpha to 1, making the radius visible
		this.alpha = 1;
		
		//if influence and boxes or platforms colliding, run influenceObject
		this.game.physics.arcade.overlap(this, this.boxes, this.influenceObject);
		this.game.physics.arcade.overlap(this, this.platforms, this.influenceObject);
	}
	else //the ball is not activated
	{
		//set the alpha to 0, making the radius invisible
		this.alpha = 0;
	}

	// rotate the circle
	this.body.rotation += 0.25 ;
	
	//exert force on influenced objects
	this.exertForce(this);
}

//enables exertion of gravity on influenced objects
GravityInfluence.prototype.influenceObject = function(influence, influencedBody)
{
	//if the body is not currently being influenced
	if(influencedBody.influenced == false)
	{
		//if the body is on camera
		if(!offCamera(influencedBody, 0))
		{
			//set influenced property to true
			influencedBody.influenced = true;
		
			//add the body to an array of influenced bodies
			influence.gravityBall.influencedArray.push(influencedBody);
		}
	}
}

//exert gravity on all influenced objects
GravityInfluence.prototype.exertForce = function(influence)
{
	//for each item in influencedArray
	for(var i = 0; i < this.gravityBall.influencedArray.length; i++)
	{
		//make sure that the object is being influenced
		if(this.gravityBall.influencedArray[i].influenced)
		{
			//get the angle between the object and the gravity ball
			var angle = this.game.physics.arcade.angleBetween(this.gravityBall.influencedArray[i], 
															  this.gravityBall);

			//if it is omnidirectional
			if(this.gravityBall.influencedArray[i].direction == "omni")
			{
				//exert gravity towards the gravity ball
				this.gravityBall.influencedArray[i].body.gravity.x = Math.cos(angle) * this.strengthX;
				this.gravityBall.influencedArray[i].body.gravity.y = Math.sin(angle) * this.strengthY;
			}
			
			//if it is a horizontal platform
			if(this.gravityBall.influencedArray[i].direction == "horizontal")
			{
				this.horizontalForce(this, this.gravityBall.influencedArray[i], angle);
			}
		
			//if it is a vertical platform
			if(this.gravityBall.influencedArray[i].direction == "vertical")
			{
				this.verticalForce(this, this.gravityBall.influencedArray[i], angle);
			}
			
			//if it is a swinging platform
			if(this.gravityBall.influencedArray[i].direction == "swing")
			{
				this.swingForce(this, this.gravityBall.influencedArray[i], angle);
			}
		}		
	}
}

GravityInfluence.prototype.horizontalForce = function(influence, influencedBody, angle)
{
	//if being influenced to the right and the platform is not too far right
	if((-Math.PI / 2) <= angle && angle <= (Math.PI / 2) && influencedBody.body.x < influencedBody.limitB)
	{
		//exert gravity
		influencedBody.body.gravity.x = Math.cos(angle) * influence.strengthX;
	}
	//else being influenced to the left and platform is not too far left
	else if((((Math.PI / 2) < angle && angle < Math.PI) || (-Math.PI < angle && angle < (-Math.PI / 2)))
		&& influencedBody.body.x > influencedBody.limitA)
	{
		//exert gravity
		influencedBody.body.gravity.x = Math.cos(angle) * influence.strengthX;
	}
	else //else something weird going on
	{
		//reset gravity
		influencedBody.body.gravity.x = 0;
	}
}

GravityInfluence.prototype.verticalForce = function(influence, influencedBody, angle)
{
	//if being influenced downwards and the platform is not too down
	if(0 <= angle && angle <= Math.PI && influencedBody.body.y < influencedBody.limitB)
	{
		//exert gravity
		influencedBody.body.gravity.y = Math.sin(angle) * influence.strengthY * 10;
	}
	//else being influenced upward and platform is not too far upward
	else if(-Math.PI <= angle && angle < 0 && influencedBody.body.y > influencedBody.limitA)
	{
		//exert gravity
		influencedBody.body.gravity.y = Math.sin(angle) * influence.strengthY * 10;
	}
	else //else something weird going on
	{
		//reset gravity
		influencedBody.body.gravity.y = 0;
	}
}

GravityInfluence.prototype.swingForce = function(influence, influencedBody, angle)
{
	//distance between the gravity ball and the swing platform
	distance = influence.game.physics.arcade.distanceBetween(influence.gravityBall, influencedBody)
					
	//if the swing is too close to the gravity ball
	if(distance < 75)
	{
		//stop the swing at the gravity ball
		influencedBody.swing.body.angularAcceleration = 0;
		influencedBody.swing.body.angularVelocity = 0;
	}
	
	//if being influenced clockwise and the swing is not too far clockwise
	if((((Math.PI / 2) < angle && angle < Math.PI) || (-Math.PI < angle && angle < (-Math.PI / 2))) &&
		influencedBody.swing.body.rotation <= 90 && influencedBody.swing.body.rotation >= -90)
	{
		//exert rotational gravity
		influencedBody.swing.body.angularAcceleration = Math.abs(Math.cos(angle)) * influence.strengthAngular;
	}
	//else being influenced counterclockwise and platform is not too far counterclockwise
	else if((-Math.PI / 2) <= angle && angle <= (Math.PI / 2) &&
		influencedBody.swing.body.rotation >= -90 && influencedBody.swing.body.rotation <= 90)
	{
		//exert rotational gravity
		influencedBody.swing.body.angularAcceleration = -Math.abs(Math.cos(angle)) * influence.strengthAngular;
	}
	else //something weird going on
	{
		//reset gravity
		influencedBody.swing.body.angularAcceleration = 0;
		influencedBody.swing.body.angularVelocity = 0;
	}
}