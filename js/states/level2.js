var Level2 = function(game){};
Level2.prototype =
{
	preload: function()
	{
		//set load path and load assets
		game.load.path = 'assets/img/sprites/';
		game.load.atlas('tutorial_atlas', 'tutorial_atlas.png', 'tutorial_atlas.json') ;
		game.load.image('radius', 'radius.png');
    
		//load audio assets
		game.load.path = 'assets/music/';
		game.load.audio('tutorial', ['tutorial.mp3', 'tutorial.ogg']);

		// load spritesheet and tilemap for terrain
		game.load.path = 'assets/img/terrain/';
		game.load.spritesheet('level2_tiles', 'level2tiles.png', 32, 32) ;
		game.load.tilemap('map', 'level2_map.json', null, Phaser.Tilemap.TILED_JSON);
	},
	create: function()
	{
		//*****TAKE OUT LATER*****
		//display state switching text
		stateText1 = game.add.text(8, 8, 'State: Level 2', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});
		stateText1 = game.add.text(8, 32, 'Press Q to switch states.', 
									{font: 'Courier New', fontSize: '24px', fill: "#FFF"});

		// add tileset from json file
		this.terrain = game.add.tilemap('map') ;

		// add image for the tileset
		this.terrain.addTilesetImage('level2tiles', 'level2_tiles');
		
		// create layers
		this.bg = this.terrain.createLayer('Background') ; // background layer
		this.bg.resizeWorld() ; // resize the world so it's the size of the background

		this.bgobj = this.terrain.createLayer('Background Objects') ; // background objects layer
		this.ground = this.terrain.createLayer('Ground') ; // ground layer
		this.water = this.terrain.createLayer('water'); //water layer, probably temporary

		// set collision for the ground tiles on the ground layer
		// tilemap.setCollision([tiles], collide (boolean), layer)
		this.terrain.setCollision([1,2,3,11,12,13], true, 'Ground') ;

		// set tile bias to 64 so collision is handled better
		game.physics.arcade.TILE_BIAS = 64 ;

		//create player object using prefab
		this.player = new Player(game, 200, 100, 'tutorial_atlas', 'idle0001'); 
		
		//add player animations
		this.player.animations.add('idle', Phaser.Animation.generateFrameNames('idle', 1, 4, '', 4), 10, true);
		this.player.animations.add('walk', Phaser.Animation.generateFrameNames('walk', 1, 4, '', 4), 10, true);
		this.player.animations.add('crouch', Phaser.Animation.generateFrameNames('crouch', 1, 4, '', 4), 10, true);
		this.player.animations.play('idle');

		//camera = new Camera(game, player, 0, 0) ;

		//create gravity ball object using prefab
		this.ball = new GravityBall(game, this.player, 'tutorial_atlas', 'gravityball');
		
		//create group for gravity boxes
		this.boxes = game.add.group();

		this.boxPlacements = [];
		
		//create boxes
		for(var i = 0; i < this.boxPlacements.length; i++)
		{
			//create a box using prefab
			this.box = new GravityBox(game, this.boxPlacements[i], 0, 'tutorial_atlas', 'box');
						//add the box to the game world and to the group
			game.add.existing(this.box);
			this.boxes.add(this.box);
		}

		//create group for sliding platforms
		this.platforms = game.add.group();
		
		//2D array of platform of platform parameters, each array contains [x, y, direction, limitA, limitB]
		this.platformParameters = [];
		
		for(var i = 0; i < this.platformParameters.length; i++)
		{
			//create new platform with (game, x, y, key, frame, direction, limitA, limitB)
			this.platform = new Platform(game, this.platformParameters[i][0], this.platformParameters[i][1],
										'tutorial_atlas', 'box', this.platformParameters[i][2],
										this.platformParameters[i][3], this.platformParameters[i][4]);
			
			//add the platform to the game world and to the group
			game.add.existing(this.platform);
			this.platforms.add(this.platform);
		}
		//create gravity influece object using prefab
		this.influence = new GravityInfluence(game, 'radius', this.ball, this.boxes, this.platforms);
		
		//place the player after the ball so they're always at the front of the screen
		game.add.existing(this.ball);
		game.add.existing(this.influence);
		game.add.existing(this.player);			
	},
	update: function()
	{
		//*****TAKE OUT LATER*****
		//switch states when player presses Q
		if(Q.justPressed())
		{
			game.state.start('Cutscene3');
		}

		//handle collision
		handleCollision(this.player, this.ball, this.boxes, this.platforms, this.ground);
		
		updateCamera(this.player, game, this.ball);
	},
}
handleCollision = function(player, ball, boxes, platforms, ground)
{
	//collide player and ground and save result in player
	player.onGround = game.physics.arcade.collide(ground, player);
	
	//collide ground and boxes
	game.physics.arcade.collide(ground, boxes);
	
	//collide player and boxes/platform, save result, and run saveObject
	player.onBox = game.physics.arcade.collide(player, boxes, player.saveObject);
	player.onPlatform = game.physics.arcade.collide(player, platforms, player.saveObject);
	
	//collide ball and boxes
	game.physics.arcade.collide(ball, boxes);
}