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

	//enable physics & physics settings
	game.physics.p2.enable(this); //enabling P2 automatically centers the anchor
	this.body.collideWorldBounds = true;
	this.body.data.gravityScale = 0; //scale of gravity's effect on this object
	
	//set gravity ball collision circle with given radius
	this.body.setCircle(28);
	
	//sets gravity ball collision group
	this.collisionGroup = game.physics.p2.createCollisionGroup();
	this.body.setCollisionGroup(this.collisionGroup);
	
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
		this.body.angle += 1 ; // rotate right
	}
	else { // if it is pulling
		this.body.angle -= 1 ; // rotate it left
	}
}

deployGravityBall = function(game, player, gravityball){
	console.log(gravityball.body.x) ;
	gravityball.deployed = true ; // set deployed equal to true

	// put the gravity ball where the mouse (or touch) is
	gravityball.body.x = game.input.activePointer.x ;
	gravityball.body.y = game.input.activePointer.y ;
}

returnGravityBall = function(game, player, gravityball){
	console.log(gravityball.body.x) ;
	gravityball.deployed = false ; // set deployed equal to false

	// move the gravity ball back behind the player
	gravityball.body.x = player.body.x - player.width ;
	gravityball.body.y = player.body.y ;
}