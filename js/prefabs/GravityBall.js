var GravityBall = function(game, player, key, frame){
	// to access these variables, use GravityBall instead of this (GravityBall.deployed)
	this.deployed = false ;	// whether or not the ball has been deployed
	this.activated = false; //whether or not the ball is exerting gravity
	this.tweening = false ; // whether or not the ball is currently tweening
	//this.direction = false ; // the direction of gravity; true = push, false = pull
	//this.controls ; // controls for the ball

	// these are just pointers to the actual player and game objects
	// so i can access them in the update function
	this.player = player ;
	this.game = game ;

	//array to hold references to objects that are being influenced 
	this.influencedArray = [];
	
	// call Sprite constructor within this object
	// put it at the same height as the player and a bit to the left
	this.sprite = Phaser.Sprite.call(this, game, 200, 200, key, frame) ;
	
	//set anchor
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;

	//enable physics & physics settings
	game.physics.arcade.enable(this);
	this.body.immovable = true; //prevents gravity ball from being moved by objects being pulled
	
	//set gravity ball collision circle with given radius
	this.body.setCircle(32);
	
	game.input.mouse.capture = true ; // allow for mouse input
	// add Q and E keys as valid inputs, Q is now 'push' and E is now 'pull'
	//this.controls = game.input.keyboard.addKeys({'push': Phaser.KeyCode.Q, 'pull': Phaser.KeyCode.E}) ;

} ;

//link the gravity ball object's prototype to the Phaser.Sprite object
GravityBall.prototype = Object.create(Phaser.Sprite.prototype) ;
GravityBall.prototype.constructor = GravityBall ;

GravityBall.prototype.update = function() {
	// if the gravity ball is deployed
	if(this.deployed && this.activated){
		// rotate the ball
		this.body.rotation -= 2 ;

		// if the pointer (mouse, touch, etc) has just been released while the gravity ball is deployed, undeploy it
		if(this.game.input.activePointer.justPressed(20)){
			returnGravityBall(this.game, this.player, this) ;
		}
	}
	else if(!this.deployed && !this.activated && !this.tweening) { // if the gravity ball is not deployed
		// update the gravity ball's position
		this.body.x = this.player.body.x - this.player.width ;
		this.body.y = this.player.body.y ;

		// if the pointer (mouse, touch, etc) has just been released, deploy the gravity ball
		if(this.game.input.activePointer.justPressed(20)){
			deployGravityBall(this.game, this.player, this) ;
		}
	}
	/*if(this.controls.push.justPressed()){ // if Q was just pressed
		this.direction = true ; // the gravity ball is now pushing
	}
	else if(this.controls.pull.justPressed()){ // else if E was just pressed
		this.direction = false ;
	}*/

	/*if(this.direction){ // if the ball is pushing
		this.body.rotation += 1 ; // rotate right
	}*/
	//else { // if it is pulling
		 // rotate it left
	//}
}

//sets a small delay before setting activated to true for balance and bugfix reasons
setActivationDelay = function(gravityball)
{
	//set a timer to run setDeployed after a second
	//time.events.add(period, function, context, args);
	game.time.events.add(Phaser.Timer.SECOND * 0.8, setActivated, this, gravityball);
	console.log("Activating Gravity Ball...");
}

setActivated = function(gravityball)
{
	gravityball.activated = true;
	console.log("Gravity Ball Activated");
}

// set the ball to not tweening so it follows the player again
setNotTweening = function(gravityball) {
	gravityball.tweening = false ;
	console.log("Gravity Ball Finished Tweening") ;
}


deployGravityBall = function(game, player, gravityball){
	console.log(gravityball.body.x) ;
	gravityball.deployed = true ; // set deployed equal to true

	// tween the ball over to where the mouse is in 400 ms 
	// game.add.tween(object).to({properties to tween to}, time (in ms), easing, auto-start) 
	var newX = game.camera.x + game.input.activePointer.x ;
	var newY = game.camera.y + game.input.activePointer.y ;
	game.add.tween(gravityball).to({ x: newX, y: newY }, 400, Phaser.Easing.Quadratic.Out, true) ;
	console.log("Gravity Ball Tweening...") ;

	// put the gravity ball where the mouse (or touch) is
	//gravityball.body.x = game.input.activePointer.x ;
	//gravityball.body.y = game.input.activePointer.y ;
	
	//activate the gravity ball after a short delay
	setActivationDelay(gravityball);
}

returnGravityBall = function(game, player, gravityball){
	console.log(gravityball.body.x) ;
	gravityball.activated = false; //deactivate the ball
	gravityball.deployed = false ; // set deployed equal to false

	// tween the ball to the player is in 100 ms 
	// game.add.tween(object).to({properties to tween to}, time (in ms), easing, auto-start)
	game.add.tween(gravityball).to({ x: (player.body.x - player.width), y: player.body.y }, 100, Phaser.Easing.Quadratic.Out, true) ;
	gravityball.tweening = true ; // the ball is now tweening
	game.time.events.add(Phaser.Timer.SECOND * 0.1, setNotTweening, this, gravityball); // after 100 ms, the ball is no longer tweening

	// move the gravity ball back behind the player
	//gravityball.body.x = player.body.x - player.width ;
	//gravityball.body.y = player.body.y ;
	
	//for each object being influenced, from the top of the array
	for(var i = gravityball.influencedArray.length - 1; i >= 0; i--)
	{
		//set the object to no longer being influenced
		gravityball.influencedArray[i].influenced = false;
		
		//reset the object's gravity to normal
		gravityball.influencedArray[i].body.gravity.x = 0;
		gravityball.influencedArray[i].body.gravity.y = worldGravity;
		
		//remove the object from the array
		gravityball.influencedArray.pop();
	}


}