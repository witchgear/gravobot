var Tutorial = function(game){};
Tutorial.prototype =
{
	preload: function()
	{
		//***TEMP UNTIL ATLAS***
		//load player spritesheet
		game.load.spritesheet('idle', 'assets/img/sprites/idle.png', 49, 64);
	},
	create: function()
	{
		//*****TAKE OUT LATER*****
		//display state switching text
		stateText1 = game.add.text(8, 8, 'State: Tutorial', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
		stateText2 = game.add.text(8, 32, 'Press Q to switch states.', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
		
		//create player object using prefab
		player = new Player(game, 420, 420, 'idle', 0);
		game.add.existing(player);
		
		//add player animations
		player.animations.add('idle', [0, 1, 2, 3, 4], 10, true);
		player.animations.play('idle');
	},
	update: function()
	{
		//*****TAKE OUT LATER*****
		//switch states when player presses space
		if(Q.justPressed())
		{
			game.state.start('Cutscene');
		}
	},
}