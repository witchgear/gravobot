//this object represents the circle of influence on gravity that the gravity ball exerts
//constructor function
function GravityInfluence(game, gravityBall, boxes)
{
	//call Phaser.Sprite from this object
	Phaser.Sprite.call(this, game, 0, 0);
	
	//store references to objects
	this.gravityBall = gravityBall;
	this.boxes = boxes;
	
	//set the strength of the gravity that the ball exerts
	this.strengthX = 20000;
	this.strengthY = 1000;
	
	//set anchor
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	
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
		//if influence and boxes colliding, run exertGravity
		this.game.physics.arcade.overlap(this, this.boxes, exertGravity);
	}
	
	//for each item in influencedArray
	for(var i = 0; i < this.gravityBall.influencedArray.length; i++)
	{
		//make sure that the object is being influenced
		if(this.gravityBall.influencedArray[i].influenced)
		{
			//get the angle between the object and the gravity ball
			var angle = this.game.physics.arcade.angleBetween(this.gravityBall.influencedArray[i], 
															  this.gravityBall);

			//exert gravity towards the gravity ball
			this.gravityBall.influencedArray[i].body.gravity.x = Math.cos(angle) * this.strengthX;
			this.gravityBall.influencedArray[i].body.gravity.y = Math.sin(angle) * this.strengthY;
		}		
	}
}

//enables exertion of gravity on influenced objects
exertGravity = function(influence, influencedBody)
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