//this object represents the circle of influence on gravity that the gravity ball exerts
//constructor function
function GravityInfluence(game, gravityBall, player)
{
	//call Phaser.Sprite from this object
	Phaser.Sprite.call(this, game, 0, 0);
	
	//store references to objects
	this.gravityBall = gravityBall;
	this.player = player;
	
	//set the strength of the gravity that the ball exerts
	this.influenceStrength = 1000;
	
	//set anchor
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	
	//enable physics and physics settings
	game.physics.arcade.enable(this);	
		
	//sets collision circle of influence with given radius
	this.body.setCircle(200); //*****NOTE: Arbitrary value, decide as a group later
}

//link the gravity influence object's prototype to the Phaser.Sprite object
GravityInfluence.prototype = Object.create(Phaser.Sprite.prototype);
GravityInfluence.prototype.constructor = GravityInfluence;

GravityInfluence.prototype.update = function()
{
	//update position of influence so it is always attached to the gravity ball
	this.body.x = this.gravityBall.body.x - 170;
	this.body.y = this.gravityBall.body.y - 170;
	
	//if the ball is activated
	if(this.gravityBall.activated)
	{
		//if influence and player colliding, run exertGravity
		game.physics.arcade.overlap(this, player, exertGravity);
	}
}

//enables exertion of gravity on influenced objects
exertGravity = function(influence, influencedBody)
{
	//if the body is not currently being influenced
	if(influencedBody.influenced == false)
	{
		//set influenced property to true
		influencedBody.influenced = true;
		console.log("GRAVITY BEING EXERTED!!!");
	}
}

//add body to ball array (ball needs to access array when return called)
//in influence update, for all in array, exert force
//force: set gravity x and y towards the ball (cos/sin(angle) * influenceStrength)
//when ball return is called, set all "being influenced" of objects in array to false
//remove objects from array, reset gravity to normal