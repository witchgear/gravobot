var disruptedLavas = [] ;
var Lava = function(game, key, x, y, below){
	console.log(y + " is my y coordinate") ;
	if(below != null)
	{
		console.log(below.y + " is the y coordinate of the lava above me") ;
	}
	// pointers!
	this.game = game ;	// game pointer
	this.below = below ; // pointer to the lava object above

	if(this.below != null) // if the below lava is not null
	{
		this.below.above = this ; // this is the one above it
	}

	this.above = null ; // pointer to the lava object below (currently null)

	this.blocked = false ; // if this lava is currently being blocked
	this.proxyBlocked = false ; // if this lava is blocked by proxy

	this.blockingBox = null ; // pointer to the box that might block this

	this.emitter = null ; // no current emitter
	this.isEmitting = false ; // not currently emitting
	
	// call Sprite constructor within this object
	// put it at the x and y coordinates with the key
	this.sprite = Phaser.Sprite.call(this, game, x, y, key) ;

	this.animations.add('fall', [0, 1, 2, 3], 8, true) ;
	this.animations.play('fall') ;

	//enable physics & physics settings
	game.physics.arcade.enable(this);
	this.body.setSize(24, 24, 4, 4);
	this.body.immovable = true ;
	
} ;

//link the gravity ball object's prototype to the Phaser.Sprite object
Lava.prototype = Object.create(Phaser.Sprite.prototype) ;
Lava.prototype.constructor = Lava;

Lava.prototype.update = function() 
{
	// manage alpha
	if(this.blocked || this.proxyBlocked) // if the lava is blocked or blocked by proxy
	{
		if(this.alpha > 0) // and it is not currently transparent
		{
			this.alpha -= 0.2 ; // reduce opacity
		}
		
	}
	else // if the lava is not blocked
	{
		if(this.alpha < 1) // and it is not fully opaque
		{
			this.alpha += 0.2 ; // increase opacity
		}
	}

	if(this.blocked) { // if the lava is blocked
		if(this.below != null && !this.below.blocked && !this.proxyBlocked)
		{
			generateLavaSplash(this.below) ;
		}
		checkIfLavaUnblocked(this) ; // check if it is unblocked
	}
	else if(!this.proxyBlocked && this.above == null)
	{
		generateLavaSplash(this) ;
	}

	if(this.below != null) // if there is a lava below this
	{
		if(this.below.proxyBlocked || this.below.blocked) { // and the lava below is blocked or proxy blocked
			this.proxyBlocked = true ; // this is blocked by proxy
		}
		else
		{
			this.proxyBlocked = false ;
		}
	}

}

// function to create a lava at a certain coordinate with a certain length
createLava = function(game, key, x, y, length, group) 
{
	// make the top level of the lava
	belowLava = new Lava(game, key, x, y, null) ; // the above field will be null
	group.add(belowLava) ; // add it to the group
	console.log(x + " " + y + " " + length);
	for(var i = 1 ; i < length ; i++) { // for the length of the lava
		console.log(y - (i*32)) ;
		lv = new Lava(game, key, x, y - (i * 32), belowLava) ; // make the next lava
		//lv.tint = 0xfff7e9;
		group.add(lv) ; // add the lava to the group
		belowLava = lv ; // set the "above" lava to the current one so they become linked
	}
}

// function to disrupt the lava when part of it collides with a box
disruptLava = function(lava, box) 
{
	// if the lava is currently onscreen
	if(lava.position.x < (lava.game.camera.position.x + lava.game.camera.width) &&
	   lava.position.x > lava.game.camera.position.x)
	{
		// if the lava is not currently inside the array of disrupted lavas
		if(disruptedLavas.indexOf(lava) == -1)
		{
			// push this into the array
			disruptedLavas.push(lava) ;
			lava.blocked = true ; // it is now blocked
			lava.blockingBox = box ; // save a pointer to the box blocking it

			//console.log(disruptedLavas) ; // log the array
		}
	}
	
}

// function to restore the lava if it is unblocked
restoreLava = function(lava) 
{
	
	lava.blocked = false ; // it is no longer blocked
	lava.blockingBox = null ; // nothing is blocking it

	//var current = lava.above ; // start with the lava above it
	//while(current != null)
	//{
	//	current.proxyBlocked = false ; // it is no longer blocked
	//	current = current.above ; // go to the next lava up
	//}
}

// function to check if the lava is unblocked
checkIfLavaUnblocked = function(lava) 
{
	var below = (lava.below == null) ; // if the lava below exists
	if(!below){ // check if it is blocked, proxyblocked or colliding with the box (just in case)
		below = !lava.below.blocked && !lava.below.proxyBlocked && !game.physics.arcade.overlap(lava.below, lava.blockingBox);
	} // if the lava is in the array but not blocked by proxy, and the lava below is not blocked
	if(disruptedLavas.indexOf(lava) > -1 && !lava.proxyBlocked && below) {
		var blocked = game.physics.arcade.overlap(lava, lava.blockingBox); // check again if this is blocked
			if(!blocked) // if it is not
			{
				restoreLava(lava) ; // restore the lava
				disruptedLavas.splice(disruptedLavas.indexOf(lava), 1) ; // remove it from the disruptedLavas array
			}
	}
}

// cheap and dirty function that kills Gravobot
killGravobot = function(gravobot, lava)
{
	if(lava.alpha == 1) { // if the lava is fully opaque
		if(gravobot.isCrouching)
		{
			gravobot.isCrouching = false ;
			gravobot.canJump = true;
			gravobot.canWalk = true;
			gravobot.body.gravity.y = worldGravity;
		}
		gravobot.body.y = 6900 ; // launch gravobot real far down so they automatically reset to the top left of the screen
	}
	// this is game design
}

// cheap and dirty function that kills Gravobot
generateLavaSplash = function(lava)
{
	if(lava.position.x < (lava.game.camera.position.x + lava.game.camera.width) &&
	   lava.position.x > lava.game.camera.position.x)
	{
		if(lava.emitter == null) 
			{ // if the lava is fully opaque
				lava.emitter = lava.game.add.emitter(lava.position.x + 16, lava.position.y, 50);
				let area = new Phaser.Rectangle(lava.position.x - 4, lava.position.y - 4, 40, 8);
				lava.emitter.area = area ;
				lava.emitter.gravity = worldGravity * -0.5 ;
				lava.emitter.makeParticles(['lavasplash'], 0, 50, true);
				lava.emitter.start(false, 100, 10, 50) ;
				game.time.events.add(Phaser.Timer.SECOND * 0.5, setLavaNotEmitting, this, lava);
				//lava.emitter.area = new Phaser.Rectangle(game.world.centerX, 0, game.world.width, 1);
			}
	}
	
}

setLavaNotEmitting = function(lava)
{
	lava.isEmitting = false ;
	//lava.emitter.kill() ;
	lava.emitter.destroy() ;
	lava.emitter = null ;
}