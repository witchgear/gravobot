//creates game variable
var game = new Phaser.Game(1000, 600, Phaser.AUTO);

var TitleScreen = function(game){};
TitleScreen.prototype =
{
	preload: function()
	{
		
	},
	create: function()
	{
		//*****TAKE OUT LATER*****
		//display state switching text
		stateText1 = game.add.text(8, 8, 'State: Title Screen', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
		stateText1 = game.add.text(8, 32, 'Press Spacebar to switch states.', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
		
		//enable physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//set variable for global gravity setting
		worldGravity = 1000;
		
		//Create input keys
		W = game.input.keyboard.addKey(Phaser.Keyboard.W); //jump/menu up
		A = game.input.keyboard.addKey(Phaser.Keyboard.A); //move left
		S = game.input.keyboard.addKey(Phaser.Keyboard.S); //menu down
		D = game.input.keyboard.addKey(Phaser.Keyboard.D); //move right
		SPACEBAR = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //also jump
	},
	update: function()
	{
		//*****TAKE OUT LATER*****
		//switch states when player presses space
		if(SPACEBAR.justPressed())
		{
			game.state.start('Tutorial');
		}
	}
}