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
		//if the body is on screen
		if(influencedBody.body.x > game.camera.position.x 
		&& influencedBody.body.x < game.camera.position.x + game.width)
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
				//if being influenced to the right and the platform is not too far right (bc fuck fascists)
				if((-Math.PI / 2) <= angle && angle <= (Math.PI / 2) &&
					this.gravityBall.influencedArray[i].body.x < this.gravityBall.influencedArray[i].limitB)
				{
					//exert gravity
					this.gravityBall.influencedArray[i].body.gravity.x = Math.cos(angle) * this.strengthX;
				}
				//else being influenced to the left and platform is not too far left
				else if((((Math.PI / 2) < angle && angle < Math.PI) || (-Math.PI < angle && angle < (-Math.PI / 2)))
					&& this.gravityBall.influencedArray[i].body.x > this.gravityBall.influencedArray[i].limitA)
				{
					//exert gravity
					this.gravityBall.influencedArray[i].body.gravity.x = Math.cos(angle) * this.strengthX;
				}
				else //else something weird going on
				{
					//reset gravity
					this.gravityBall.influencedArray[i].body.gravity.x = 0;
				}
			}
		
			//if it is a vertical platform
			if(this.gravityBall.influencedArray[i].direction == "vertical")
			{
				//if being influenced downwards and the platform is not too down
				if(0 <= angle && angle <= Math.PI && this.gravityBall.influencedArray[i].body.y <
					this.gravityBall.influencedArray[i].limitB)
				{
					//exert gravity
					this.gravityBall.influencedArray[i].body.gravity.y = Math.sin(angle) * this.strengthY * 10;
				}
				//else being influenced upward and platform is not too far upward
				else if(-Math.PI <= angle && angle < 0 && this.gravityBall.influencedArray[i].body.y >
						this.gravityBall.influencedArray[i].limitA)
				{
					//exert gravity
					this.gravityBall.influencedArray[i].body.gravity.y = Math.sin(angle) * this.strengthY * 10;
				}
				else //else something weird going on
				{
					//reset gravity
					this.gravityBall.influencedArray[i].body.gravity.y = 0;
				}
			}
		}		
	}
}