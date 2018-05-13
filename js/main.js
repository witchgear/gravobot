//creates game variable
var game = new Phaser.Game(1024, 576, Phaser.AUTO);

var Boot = function(game){};
Boot.prototype =
{
	create: function()
	{
		//Create input keys
		W = game.input.keyboard.addKey(Phaser.Keyboard.W); //jump/menu up
		A = game.input.keyboard.addKey(Phaser.Keyboard.A); //move left
		S = game.input.keyboard.addKey(Phaser.Keyboard.S); //menu down
		D = game.input.keyboard.addKey(Phaser.Keyboard.D); //move right
		SPACEBAR = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //also jump, confirm
		Q = game.input.keyboard.addKey(Phaser.Keyboard.Q); //debug functions
		
		//enable physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//set variable for global gravity setting
		worldGravity = 1000;
		
		game.state.start('Title');
	}
}