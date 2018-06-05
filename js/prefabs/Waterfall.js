var Waterfall = function(game, key, x, y, above){
	// pointers!
	this.game = game ;	// game pointer
	this.above = above ; // pointer to the waterfall object above

	if(this.above != null) // if the above waterfall is not null
	{
		this.above.below = this ; // this is the one below it
	}

	this.below = null ; // pointer to the waterfall object below (currently null)

	this.blocked = false ; // if this waterfall is currently being blocked
	this.proxyBlocked = false ; // if this waterfall is blocked by proxy

	this.blockingBox = null ; // pointer to the box that might block this
	
	// call Sprite constructor within this object
	// put it at the x and y coordinates with the key
	this.sprite = Phaser.Sprite.call(this, game, x, y, key) ;

	//enable physics & physics settings
	game.physics.arcade.enable(this);
	
} ;

//link the gravity ball object's prototype to the Phaser.Sprite object
Waterfall.prototype = Object.create(Phaser.Sprite.prototype) ;
Waterfall.prototype.constructor = Waterfall;

Waterfall.prototype.update = function() 
{
	// manage alpha
	if(this.blocked || this.proxyBlocked) // if the waterfall is blocked or blocked by proxy
	{
		if(this.alpha > 0) // and it is not currently transparent
		{
			this.alpha -= 0.1 ; // reduce opacity
		}
		
	}
	else // if the waterfall is not blocked
	{
		if(this.alpha < 1) // and it is not fully opaque
		{
			this.alpha += 0.1 ; // increase opacity
		}
	}

	if(this.blocked) { // if the waterfall is blocked
		checkIfUnblocked(this) ; // check if it is unblocked
	}

	if(this.above != null) // if there is a waterfall above this
	{
		if(this.above.proxyBlocked || this.above.blocked) { // and the waterfall above is blocked or proxy blocked
			this.proxyBlocked = true ; // this is blocked by proxy
		}
	}

}

// function to create a waterfall at a certain coordinate with a certain length
createWaterfall = function(game, key, x, y, length, group) 
{
	// make the top level of the waterfall
	aboveWaterfall = new Waterfall(game, key, x, y, null) ; // the above field will be null
	group.add(aboveWaterfall) ; // add it to the group
	for(var i = 1 ; i < length ; i++) { // for the length of the waterfall
		wf = new Waterfall(game, key, x, y + (i * 32), aboveWaterfall) ; // make the next waterfall
		group.add(wf) ; // add the waterfall to the group
		aboveWaterfall = wf ; // set the "above" waterfall to the current one so they become linked
	}
}

// function to disrupt the waterfall when part of it collides with a box
disruptWaterfall = function(waterfall, box) 
{
	// if the waterfall is currently onscreen
	if(waterfall.position.x < (waterfall.game.camera.position.x + waterfall.game.camera.width) &&
	   waterfall.position.x > waterfall.game.camera.position.x)
	{
		// if the waterfall is not currently inside the array of disrupted waterfalls
		if(disruptedWaterfalls.indexOf(waterfall) == -1)
		{
			// push this into the array
			disruptedWaterfalls.push(waterfall) ;
			waterfall.blocked = true ; // it is now blocked
			waterfall.blockingBox = box ; // save a pointer to the box blocking it

			console.log(disruptedWaterfalls) ; // log the array
		}
	}
	
}

// function to restore the waterfall if it is unblocked
restoreWaterfall = function(waterfall) 
{
	
	waterfall.blocked = false ; // it is no longer blocked
	waterfall.blockingBox = null ; // nothing is blocking it

	var current = waterfall.below ; // start with the waterfall below it
	while(current != null)
	{
		current.proxyBlocked = false ; // it is no longer blocked
		current = current.below ; // go to the next waterfall down
	}
}

// function to check if the waterfall is unblocked
checkIfUnblocked = function(waterfall) 
{
	var above = (waterfall.above == null) ; // if the waterfall above exists
	if(!above){ // check if it is blocked, proxyblocked or colliding with the box (just in case)
		above = !waterfall.above.blocked && !waterfall.above.proxyBlocked && !game.physics.arcade.overlap(waterfall.above, waterfall.blockingBox);
	} // if the waterfall is in the array but not blocked by proxy, and the waterfall above is not blocked
	if(disruptedWaterfalls.indexOf(waterfall) > -1 && !waterfall.proxyBlocked && above) {
		var blocked = game.physics.arcade.overlap(waterfall, waterfall.blockingBox); // check again if this is blocked
			if(!blocked) // if it is not
			{
				restoreWaterfall(waterfall) ; // restore the waterfall
				disruptedWaterfalls.splice(disruptedWaterfalls.indexOf(waterfall), 1) ; // remove it from the disruptedWaterfalls array
			}
	}
}

// cheap and dirty function that kills Gravobot
killGravobot = function(gravobot, waterfall)
{
	if(waterfall.alpha == 1) { // if the waterfall is fully opaque
		gravobot.body.y = 6900 ; // launch gravobot real far down so they automatically reset to the top left of the screen
	}
	// this is game design
}