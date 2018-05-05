//this object represents the circle of influence on gravity that the gravity ball exerts
//constructor function
function GravityInfluence(game, playerGroup)
{
	//call Phaser.Sprite from this object
	Phaser.Sprite.call(this, game, 0, 0);
	
	//store the collision groups of objects that the ball can exert gravity on
	this.playerGroup = playerGroup;
	//*****NOTE: when objects are added, store that collision group too
	//			 possibly create the group in the level state and add objects to the group
	
	//makes sprite invisible
	//*****NOTE: maybe this object should have like, a dotted line sprite or something
	//*****      thats visible when the ball is deployed?
	this.visible = false;
	
	//enable physics and physics settings
	game.physics.p2.enable(this, true); //visible collision box for now to debug
	this.body.data.gravityScale = 0;
		
	//sets collision circle of influence with given radius
	this.body.setCircle(200); //*****NOTE: Arbitrary value, decide as a group later
	
	/*makes the influence collision circle a sensor, meaning that it doesn't actually collide 
	  with objects but still triggers collision events*/
	this.body.data.shapes[0].sensor = true;
	
	//sets influence collision group
	this.collisionGroup = game.physics.p2.createCollisionGroup();
	this.body.setCollisionGroup(this.collisionGroup);
	
	this.body.createGroupCallback(playerGroup, exertGravity, this);
}

//link the gravity influence object's prototype to the Phaser.Sprite object
GravityInfluence.prototype = Object.create(Phaser.Sprite.prototype);
GravityInfluence.prototype.constructor = GravityInfluence;

//enables exertion of gravity on influenced objects
exertGravity = function(body, influencedBody, shapeA, shapeB)
{
	//console.log(deployed);
	//only if ball is deployed
	//if(deployed)
	//{
		console.log("GRAVITY BEING EXERTED!!!");
	//}
}

//FIGURE OUT HOW TO ACTIVATE THE EVENT WHEN PLAYER TOUCHES THE THING
//when deployed, set the circle, enable impact event, maybe create the whole fucking body
//when returned, clear the circle
//in exert force: if(gravityable) (add property to all objects)
//or if dynamic && gravityable to avoid checking terrain
//or check if body is certain object, hardest but most precise
//impact event sets "being influenced" property of hit object true
//or add to ball array already
//add all objects being influenced to an array in GravityBall
//in update loop, if(being influenced), exert force, gravity scale = 0,
//or, in ball update, for all in array, exert force
//when ball is returned, set all "being influenced" of objects in array to false
//remove objects from array
//or, in update, if not deployed, if array length > 0, pop from array