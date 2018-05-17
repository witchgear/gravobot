function Dialogue(game, file, x, y, font, voice)
{
	// set pointer to the JSON file
	this.file = file ;

	// set some other variables
	this.actor = '' ; // current actor's name
	this.line = 0 ; // current line of text
	this.voice = voice ; // current voice
	//this.char = '' ; // current character
	this.frameBuffer = 0 ; // frame buffer for parsing text
	this.delay = 4 ;

	//call Phaser.bitmapText from this object
	//call(object to call function in, game object, x, y, font, text)
	Phaser.BitmapText.call(this, game, x, y, font, '') ;

}

//link the player object's prototype to the Phaser.Sprite object
Dialogue.prototype = Object.create(Phaser.BitmapText.prototype);
Dialogue.prototype.constructor = Dialogue;

Dialogue.prototype.update = function()
{
	// if there are no more lines of dialogue, do nothing
	if(this.line == this.file.dialogue.length)
	{

	} // else if the frameBuffer has been reset to 0
	else if(this.frameBuffer == 0)
	{
		this.initializeLine() ; // start the next line of dialogue
	} // else if the end of the current line has already been reached
	else if((this.frameBuffer / this.delay) >= this.file.dialogue[this.line].line.length)
	{
		this.voice.stop() ;
		if(SPACEBAR.justPressed()) // if the player presses the spacebar
		{
			this.line++ ; // go to the next line
			this.frameBuffer = 0 ; // reset the frameBuffer
		}
	}
	else if(this.frameBuffer % this.delay == 0) // else if the delay is complete
	{
		console.log(this.frameBuffer) ;
		this.progressLine() ;
	}
	else // if nothing else, increase frame buffer
	{
		this.frameBuffer++ ;
	}
}

Dialogue.prototype.initializeLine = function()
{
	// set the current actor to the actor from the json file
	this.actor = this.file.dialogue[this.line].actor ;
	this.voice.play() ; // play voice blip
	this.text = this.actor + '\n' ;
	this.text += this.file.dialogue[this.line].line.charAt(0) ;
	this.frameBuffer++ ;

}

Dialogue.prototype.progressLine = function()
{
	var nextChar = this.frameBuffer/this.delay ; // find the index of the next character
	this.text += this.file.dialogue[this.line].line.charAt(nextChar) ; // append it to the current string
	this.frameBuffer++ ;
}