function Dialogue(game, file, x, y, font, voice1, voice2, bg, dialogueBox, queen, gravobot, empress, blackbox, bg2)
{
	// set pointer to the JSON file
	this.file = file ;

	this.game = game ;

	// set some other variables
	this.actor = '' ; // current actor's name
	this.line = 0 ; // current line of text
	this.voice1 = voice1; // current voice
	this.voice2 = voice2;
	//this.char = '' ; // current character
	this.frameBuffer = 0 ; // frame buffer for parsing text
	this.delay = 4 ; // delay
	this.finished = false ; // whether or not the dialogue has finished

	this.dialogueBox = dialogueBox ; // add a pointer to the dialogueBox sprite

	// add pointers to sprites
	this.queen = queen ;
	this.gravobot = gravobot ;
	this.empress = empress ;

	this.bg = bg ;

	this.bb = blackbox ;

	this.bg2 = bg2 ;

	//console.log(this.queen) ;
	//console.log(this.gravobot) ;

	//call Phaser.bitmapText from this object
	//call(object to call function in, game object, x, y, font, text)
	Phaser.BitmapText.call(this, game, x, y, font, '') ;

	this.game.input.mouse.capture = true ; // allow for mouse input

}

//link the player object's prototype to the Phaser.Sprite object
Dialogue.prototype = Object.create(Phaser.BitmapText.prototype);
Dialogue.prototype.constructor = Dialogue;

Dialogue.prototype.update = function()
{
	if(this.game.input.activePointer.justPressed(30)){
		console.log("click!");
	}
	// if there are no more lines of dialogue, do nothing
	if(this.line == this.file.dialogue.length)
	{
		this.finished = true ;
	} // else if the frameBuffer has been reset to 0
	else if(this.frameBuffer == 0)
	{
		this.initializeLine() ; // start the next line of dialogue
	} // else if the end of the current line has already been reached
	else if((this.frameBuffer / this.delay) >= this.file.dialogue[this.line].line.length)
	{
		this.voice1.stop();
		this.voice2.stop();
		
		if(this.game.input.activePointer.justPressed(30)) // if the player clicks
		{
			this.handleFade() ;
			this.line++ ; // go to the next line
			this.frameBuffer = 0 ; // reset the frameBuffer
		}
	}
	else if(this.frameBuffer % this.delay == 0) // else if the delay is complete
	{
		if(this.game.input.activePointer.justPressed(30))
		{
			this.skipToEndOfLine() ; // skip to the end of the line if click
		}
		else 
		{
			this.progressLine() ; // otherwise progress the line
		}
	}
	else // if nothing else, increase frame buffer
	{
		this.frameBuffer++ ;

		if(this.game.input.activePointer.justPressed(30)) // and if click
		{
			this.skipToEndOfLine() ; // skip to the end of the line
		}
	}
}

// function to initialize new line of dialogue
Dialogue.prototype.initializeLine = function()
{
	// set the current actor to the actor from the json file
	this.actor = this.file.dialogue[this.line].actor ;

	if(this.actor == 'SPACE QUEEN'){
		this.queen.position.x = 0 ;
		this.queen.position.y = this.game.height - this.queen.height ;
	}

	if(this.actor == 'GRAVOBOT'){
		this.gravobot.position.x = this.game.width - this.gravobot.width ;
		this.gravobot.position.y = this.game.height - this.gravobot.height ;
	}

	// comment this out once empress sprite is done
	if(this.empress != null && this.actor == 'SPACE EMPRESS'){
		this.empress.position.setTo(this.game.width/2, this.game.height - this.empress.height) ;
	}

	// set delay equal to delay from json file divided by 2
	this.delay = this.file.dialogue[this.line].delay / 2 ;
	
	if(this.file.dialogue[this.line].voice == "queentalk")
	{
		this.voice1.play(); // play voice blip
	}
	else if(this.file.dialogue[this.line].voice == "empresstalk")
	{
		this.voice2.play();
	}
	else
	{
		this.voice1.stop();
		this.voice2.stop();
	}

	// reset text
	this.text = "" ;

	// add spaces to make name even
	for(var i = 0 ; i < 13 - this.file.dialogue[this.line].actor.length ; i+=2)
	{
		this.text += " " ;
	}

	// add actor name and newlines
	this.text += this.actor + '\n\n' ;
	this.text += this.file.dialogue[this.line].line.charAt(0) ; // add first character
	this.frameBuffer++ ; // increase frame buffer

}

// function to skip to the end of a line of dialogue
Dialogue.prototype.skipToEndOfLine = function()
{
	// find the next char from the dialogue line
	var nextChar = Math.floor(this.frameBuffer/this.delay) ;
	if(this.frameBuffer % this.delay > 0) // if the delay hasn't been met yet
	{
		nextChar += 1 ; // increase the char index to avoid repeat characters
	}

	// add the rest of the characters frm the line
	for(i = nextChar ; i < this.file.dialogue[this.line].line.length ; i++)
	{
		this.text += this.file.dialogue[this.line].line.charAt(i) ;
	}

	// increase the framerate so that on the next update the line is finished
	this.frameBuffer = this.delay * this.file.dialogue[this.line].line.length ;
}

// function to add another character to the line
Dialogue.prototype.progressLine = function()
{
	var nextChar = this.frameBuffer/this.delay ; // find the index of the next character
	if(this.file.dialogue[this.line].line.charAt(nextChar) == '`'){
		console.log(this.file.dialogue[this.line].line.charAt(nextChar)) ;
	}
	this.text += this.file.dialogue[this.line].line.charAt(nextChar) ; // append it to the current string
	this.frameBuffer++ ;
}

// function to handle "fade" (currently just the opacity of the dialogue box)
Dialogue.prototype.handleFade = function()
{
	if(this.file.dialogue[this.line].fade != 0){
		if(this.file.dialogue[this.line].fade > 0) // if the fade value from the json file is 1
		{
			this.dialogueBox.alpha = 1 ; // the dialogue box is visible
		}
		else if(this.file.dialogue[this.line].fade < 0){ // if it is -1
			this.dialogueBox.alpha = 0 ; // the dialogue box is now invisible
		}

		if(this.file.dialogue[this.line].fade % 2 == 0)
		{
			this.game.add.tween(this.queen).to({ alpha: 1}, 200, Phaser.Easing.Linear.Out, true) ;
			this.game.add.tween(this.gravobot).to({ alpha: 1}, 200, Phaser.Easing.Linear.Out, true) ;
			this.game.add.tween(this.bg).to({ alpha: 1}, 200, Phaser.Easing.Linear.Out, true) ;
		}
		else if(this.file.dialogue[this.line].fade % 3 == 0)
		{
			this.game.add.tween(this.bb).to({ alpha: 1}, 200, Phaser.Easing.Linear.Out, true) ;
			
		}

		if(this.file.dialogue[this.line].fade % 5 == 0)
		{
			this.game.camera.shake(0.01, 1000) ;
		}

		if(this.file.dialogue[this.line].fade % 11 == 0)
		{
			this.game.add.tween(this.queen).to({ alpha: 0}, 200, Phaser.Easing.Linear.Out, true) ;
			this.game.add.tween(this.gravobot).to({ alpha: 0}, 200, Phaser.Easing.Linear.Out, true) ;
			this.game.add.tween(this.bg).to({ alpha: 0}, 200, Phaser.Easing.Linear.Out, true) ;
			if(this.bg2 != null)
			{
				this.bg2.kill() ;
			}
		}

		if(this.file.dialogue[this.line].fade % 7 == 0 && this.empress != null)
		{
			this.empress.scale.x *= -1 ;
		}
	}
}