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

		// load spritesheet and tilemap for terrain
		game.load.path = 'assets/img/terrain/';
		game.load.spritesheet('tutorialtiles', 'tutorialtiles.png', 32, 32) ;
		game.load.tilemap('map', 'tutorial_map.json', null, Phaser.Tilemap.TILED_JSON);
	},
	create: function()
	{
		//enable physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		

		// add tileset from json file
		this.terrain = game.add.tilemap('map') ;

		// add image for the tileset
		this.terrain.addTilesetImage('tutorial_tiles', 'tutorialtiles') ;
		
		// create layers
		this.bg = this.terrain.createLayer('Background') ; // background layer
		this.bg.resizeWorld() ; // resize the world so it's the size of the background

		this.bgobj = this.terrain.createLayer('Background Objects') ; // background objects layer
		this.ground = this.terrain.createLayer('Ground') ; // ground layer

		// set collision for the ground tiles on the ground layer
		// tilemap.setCollision([tiles], collide (boolean), layer)
		this.terrain.setCollision([12, 20], true, 'Ground') ;


		//*****TAKE OUT LATER*****
		//display state switching text
		stateText1 = game.add.text(8, 8, 'State: Tutorial', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
		stateText2 = game.add.text(8, 32, 'Press S to switch states.', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
		
		//set variable for global gravity setting
		worldGravity = 1000;
		
		//create player object using prefab
		player = new Player(game, 100, 100, 'idle', 0); 
		this.player = player ; // create pointer to the player object so it can be accessed from update()
		
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
		// collide the player with the ground
		game.physics.arcade.collide(this.ground, this.player) ;

		//*****TAKE OUT LATER*****
		//switch states when player presses s
		if(S.justPressed())
		{
			game.state.start('Cutscene');
		}
	},
	render: function()
	{
		/*game.debug.body(player);
		game.debug.body(influence);
		game.debug.body(ball);*/
	}
}