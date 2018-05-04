var Tutorial = function(game){};
Tutorial.prototype =
{
	preload: function()
	{
		//***TEMP UNTIL ATLAS***
		//set load path and load assets
		game.load.path = 'assets/img/sprites/';
		game.load.spritesheet('idle', 'idle.png', 49, 64);
		game.load.image('ball', 'gravityball.png');
	},
	create: function()
	{
		//*****TAKE OUT LATER*****
		//display state switching text
		stateText1 = game.add.text(8, 8, 'State: Tutorial', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
		stateText2 = game.add.text(8, 32, 'Press S to switch states.', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
		
		//create player object using prefab
		player = new Player(game, 420, 420, 'idle', 0);
		
		//add player animations
		player.animations.add('idle', [0, 1, 2, 3, 4], 10, true);
		player.animations.play('idle');
		
		//create gravity ball object using prefab
		ball = new GravityBall(game, player, 'ball');
		
		//place the player after the ball so they're always at the front of the screen
		game.add.existing(ball);
		game.add.existing(player);
		
		//creates collision group for the world bounds
		game.physics.p2.updateBoundsCollisionGroup();
	},
	update: function()
	{
		//*****TAKE OUT LATER*****
		//switch states when player presses s
		if(S.justPressed())
		{
			game.state.start('Cutscene');
		}
	}
}