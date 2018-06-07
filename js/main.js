//creates game variable
var game = new Phaser.Game(1024, 576, Phaser.AUTO);

var Boot = function(game){};
Boot.prototype =
{
	preload: function()
	{
		game.load.path = 'assets/font/';
		game.load.bitmapFont('menutext','font.png','font.fnt'); //loads bitmap font
	},
	create: function()
	{
		//Create input keys
		W = game.input.keyboard.addKey(Phaser.Keyboard.W); //jump, menu up
		A = game.input.keyboard.addKey(Phaser.Keyboard.A); //move left
		S = game.input.keyboard.addKey(Phaser.Keyboard.S); //crouch, menu down
		D = game.input.keyboard.addKey(Phaser.Keyboard.D); //move right
		cursors = game.input.keyboard.createCursorKeys(); //alternate controls
		SPACEBAR = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //also jump, confirm
		Q = game.input.keyboard.addKey(Phaser.Keyboard.Q); //debug functions
		
		//enable physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//set variable for global gravity setting
		worldGravity = 1000;
		
		game.state.start('Title');
	}
}

var createLoadingScreen = function()
{
	//create load text variable and set properties
	this.loadText = game.add.bitmapText(420, 275, 'menutext', "", '28')
	
	//update load progress when loading starts and when a file is done loading
	game.load.onLoadStart.add(updateLoadProgress);
	game.load.onFileComplete.add(updateLoadProgress);
	
	//erase the loading text when loading is complete
	game.load.onLoadComplete.add(removeLoadText);
}

var updateLoadProgress = function()
{
	loadText.text = "Loading: " + game.load.progress + "%";
}

var removeLoadText = function()
{
	loadText.text = "";
}