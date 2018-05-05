var GravityBall = function(game, player, frame){
	// to access these variables, use GravityBall instead of this (GravityBall.deployed)
	this.deployed = false ;	// whether or not the ball has been deployed
	this.activated = false; //whether or not the ball is exerting gravity
	this.direction = false ; // the direction of gravity; true = push, false = pull
	this.controls ; // controls for the ball

	// these are just pointers to the actual player and game objects
	// so i can access them in the update function
	this.player = player ;
	this.game = game ;

	// call Sprite constructor within this object
	// put it at the same height as the player and a bit to the left
	this.sprite = Phaser.Sprite.call(this, game, 200, 200, frame) ;
	
	//set anchor
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;

	//enable physics & physics settings
	game.physics.arcade.enable(this);	
	
	//set gravity ball collision circle with given radius
	this.body.setCircle(28, -3, -3);
	
	game.input.mouse.capture = true ; // allow for mouse input
	// add Q and E keys as valid inputs, Q is now 'push' and E is now 'pull'
	this.controls = game.input.keyboard.addKeys({'push': Phaser.KeyCode.Q, 'pull': Phaser.KeyCode.E}) ;

} ;

//link the gravity ball object's prototype to the Phaser.Sprite object
GravityBall.prototype = Object.create(Phaser.Sprite.prototype) ;
GravityBall.prototype.constructor = GravityBall ;

GravityBall.prototype.update = function() {
	// if the gravity ball is deployed
	if(this.deployed){
		// if the pointer (mouse, touch, etc) has just been released while the gravity ball is deployed, undeploy it
		if(this.game.input.activePointer.justPressed(20)){
			returnGravityBall(this.game, this.player, this) ;
		}
	}
	else { // if the gravity ball is not deployed
		// update the gravity ball's position
		this.body.x = this.player.body.x - this.player.width ;
		this.body.y = this.player.body.y ;

		// if the pointer (mouse, touch, etc) has just been released, deploy the gravity ball
		if(this.game.input.activePointer.justPressed(20)){
			deployGravityBall(this.game, this.player, this) ;
		}
	}
	if(this.controls.push.justPressed()){ // if Q was just pressed
		this.direction = true ; // the gravity ball is now pushing
	}
	else if(this.controls.pull.justPressed()){ // else if E was just pressed
		this.direction = false ;
	}

	// rotate the ball
	if(this.direction){ // if the ball is pushing
		this.body.rotation += 1 ; // rotate right
	}
	else { // if it is pulling
		this.body.rotation -= 1 ; // rotate it left
	}
}

//sets a small delay before setting activated to true for collision bugfix reasons
setActivationDelay = function(gravityball)
{
	//set a timer to run setDeployed after a second
	//time.events.add(period, function, context, args);
	game.time.events.add(Phaser.Timer.SECOND, setActivated, this, gravityball);
	console.log("Activating Gravity Ball...");
}

setActivated = function(gravityball)
{
	gravityball.activated = true;
	console.log("Gravity Ball Activated");
}

deployGravityBall = function(game, player, gravityball){
	console.log(gravityball.body.x) ;
	gravityball.deployed = true ; // set deployed equal to true
	
	// put the gravity ball where the mouse (or touch) is
	gravityball.body.x = game.input.activePointer.x ;
	gravityball.body.y = game.input.activePointer.y ;
	
	//activate the gravity ball after a short delay
	setActivationDelay(gravityball);
}

returnGravityBall = function(game, player, gravityball){
	console.log(gravityball.body.x) ;
	gravityball.deployed = false ; // set deployed equal to false
	gravityball.activated = false; //deactivate the ball

	// move the gravity ball back behind the player
	gravityball.body.x = player.body.x - player.width ;
	gravityball.body.y = player.body.y ;
	
	//*****NOTE: change to array
	player.influenced = false;
}