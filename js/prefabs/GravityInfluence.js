//this object represents the circle of influence on gravity that the gravity ball exerts
//constructor function
function GravityInfluence(game, GravityBall)
{
	//call Phaser.Sprite from this object
	Phaser.Sprite.call(this, game, GravityBall.body.x, GravityBall.body.x);
	
	//adds object properties
	this.gravityBall = GravityBall;
	
	//makes sprite invisible
	//*****NOTE: maybe this object should have like, a dotted line sprite or something
	//*****      thats visible when the ball is deployed?
	this.visible = false;
	
	//enable physics and physics settings
	game.physics.p2.enable(this, true); //visible collision box for now to debug
	this.body.data.gravityScale = 0;
	
	//sets collision circle with given radius
	this.body.setCircle(200); //*****NOTE: Arbitrary value, decide as a group later
}

//link the gravity influence object's prototype to the Phaser.Sprite object
GravityInfluence.prototype = Object.create(Phaser.Sprite.prototype);
GravityInfluence.prototype.constructor = GravityInfluence;

//gravity influence object's individual update loop
GravityInfluence.prototype.update = function()
{
	//update position so influence is always attached to the gravity ball
	this.body.x = this.gravityBall.body.x;
	this.body.y = this.gravityBall.body.y;
}