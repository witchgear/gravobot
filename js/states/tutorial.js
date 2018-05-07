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
		
		//enable physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//set variable for global gravity setting
		worldGravity = 1000;
		
		//create player object using prefab
		player = new Player(game, 420, 420, 'idle', 0);
		
		//add player animations
		player.animations.add('idle', [0, 1, 2, 3, 4], 10, true);
		player.animations.play('idle');
		
		//create gravity ball object using prefab
		ball = new GravityBall(game, player, 'ball');
		
		//create gravity influece object using prefab
		influence = new GravityInfluence(game, ball, player);
		
		//place the player after the ball so they're always at the front of the screen
		game.add.existing(ball);
		game.add.existing(influence);
		game.add.existing(player);
	},
	update: function()
	{
		//*****TAKE OUT LATER*****
		//switch states when player presses s
		if(S.justPressed())
		{
			game.state.start('Cutscene');
		}
	},
	render: function()
	{
		game.debug.body(player);
		game.debug.body(influence);
		game.debug.body(ball);
	}
}