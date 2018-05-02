var GravityBall = function(game, player, frame){
	// to access these variables, use GravityBall instead of this (GravityBall.deployed)
	this.deployed = false ;	// whether or not the ball has been deployed
	this.direction = true ; // the direction of gravity; true = push, false = pull
	this.controls ; // controls for the ball

	// these are just pointers to the actual player and game objects
	// so i can access them in the update function
	this.player = player ;
	this.game = game ;

	// call Sprite constructor within this object
	// put it at the same height as the player and a bit to the left
	this.sprite = Phaser.Sprite.call(this, game, 200, 200, frame) ;

	// once I figure out how P2 physics work I'll enable them here maybe
	this.anchor.set(0.5) ; // reset anchor
	
	game.input.mouse.capture = true ; // allow for mouse input
	// add Q and E keys as valid inputs, Q is now 'push' and E is now 'pull'
	this.controls = game.input.keyboard.addKeys({'push': Phaser.KeyCode.Q, 'pull': Phaser.KeyCode.E}) ;

} ;

//link the player object's prototype to the Phaser.Sprite object
GravityBall.prototype = Object.create(Phaser.Sprite.prototype) ;
GravityBall.prototype.constructor = GravityBall ;

GravityBall.prototype.update = function() {
	// if the gravity ball is deployed
	if(this.deployed){
		// if the pointer (mouse, touch, etc) has just been released while the gravity ball is deployed, undeploy it
		if(this.game.input.activePointer.justReleased(20)){
			returnGravityBall(this.game, this.player, this) ;
		}
	}
	else { // if the gravity ball is not deployed
		// update the gravity ball's position
		this.position.x = this.player.position.x - this.player.width ;
		this.position.y = this.player.position.y ;

		// if the pointer (mouse, touch, etc) has just been released, deploy the gravity ball
		if(this.game.input.activePointer.justReleased(20)){
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
		this.angle += 1 ; // rotate right
	}
	else { // if it is pulling
		this.angle -= 1 ; // rotate it left
	}
}

deployGravityBall = function(game, player, gravityball){
	console.log(gravityball.position.x) ;
	gravityball.deployed = true ; // set deployed equal to true

	// put the gravity ball where the mouse (or touch) is
	gravityball.position.x = game.input.activePointer.x ;
	gravityball.position.y = game.input.activePointer.y ;
}

returnGravityBall = function(game, player, gravityball){
	console.log(gravityball.position.x) ;
	gravityball.deployed = false ; // set deployed equal to false

	// move the gravity ball back behind the player
	gravityball.position.x = player.position.x - player.width ;
	gravityball.position.y = player.position.y ;
}