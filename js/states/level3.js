var Level3 = function(game){};
Level3.prototype =
{
	preload: function()
	{
		createLoadingScreen();
		
		//load audio assets
		game.load.path = 'assets/music/';
		game.load.audio('lava', ['lava.mp3', 'lava.ogg']);

		// load json assets
		game.load.path = 'assets/json/';
		game.load.json('waterfall_placement', 'waterfall_placement.json');

		//set load path and load assets
		game.load.path = 'assets/img/sprites/';
		game.load.atlas('tutorial_atlas', 'atlas.png', 'atlas.json') ;
		game.load.image('radius', 'radius.png');

		// load spritesheet and tilemap for terrain
		game.load.path = 'assets/img/terrain/';
		game.load.spritesheet('level3_tiles', 'level3tiles.png', 32, 32) ;
		game.load.tilemap('map', 'level3_map.json', null, Phaser.Tilemap.TILED_JSON);

	},
	create: function()
	{
		// add tileset from json file
		this.terrain = game.add.tilemap('map') ;

		// add image for the tileset
		this.terrain.addTilesetImage('level3tiles', 'level3_tiles');
		
		// create layers
		this.lavafall = this.terrain.createLayer('LavaFall');
		this.lava = this.terrain.createLayer('Lava') ; // lava layer
		this.ground = this.terrain.createLayer('Ground') ;
		this.bgobj = this.terrain.createLayer('Background Object');
		this.bg = this.terrain.createLayer('Background') ; // background layer
		this.bg.resizeWorld() ; // resize the world so it's the size of the background

		// set collision for the ground tiles on the ground layer
		// tilemap.setCollision([tiles], collide (boolean), layer)
		this.terrain.setCollision([1,2,3,9,10,11,17,18], true, 'Ground') ;
		
		// set tile bias to 64 so collision is handled better
		game.physics.arcade.TILE_BIAS = 64 ;
		//create player object using prefab
		this.player = new Player(game, 200, 100, 'tutorial_atlas', 'idle0001'); 
		
		//add player animations
		this.player.animations.add('idle', Phaser.Animation.generateFrameNames('idle', 1, 4, '', 4), 10, true);
		this.player.animations.add('walk', Phaser.Animation.generateFrameNames('walk', 1, 4, '', 4), 10, true);
		this.player.animations.add('crouch', Phaser.Animation.generateFrameNames('crouch', 1, 4, '', 4), 10, true);
		this.player.animations.play('idle');

		//create gravity ball object using prefab
		this.ball = new GravityBall(game, this.player, 'tutorial_atlas', 'gravityball');
		
		//create group for gravity boxes
		this.boxes = game.add.group();
		
		//array of gravity box x coordinates
		this.boxPlacements = [game.width*0+32*14,game.width*1+32*3,game.width*2+32*2,game.width*3+32*18,
		game.width*4+32*3]
		
		//create boxes
		
		for(var i = 0; i < this.boxPlacements.length; i++)
		{
			//create a box using prefab
			this.box = new GravityBox(game, this.boxPlacements[i], 0, 'tutorial_atlas', 'box');
						//add the box to the game world and to the group
			game.add.existing(this.box);
			this.boxes.add(this.box);
		}
		

		//note: the order of this code matters, the swing group must be created before the
		//		platforms group or the platform sprite will be behind the swing rope
		this.swings = game.add.group()
		this.platforms = game.add.group();
		
		//2d array of coordinates for the top of the swing rope, each array contains [x, y]
		this.swingPlacements = [[game.width*1+32*15,32*-5],[game.width*2+32*2,32*-4],
		[game.width*3+32*16]];
		
		//create swings
		for(var i = 0; i < this.swingPlacements.length; i++)
		{
			//create a swing platform (coordinates and limits are irrelevant for swings)
			this.swingPlatform = new Platform(game, 50, 50, 'tutorial_atlas', 'box', "swing", 0, 1);
			
			//create the swing rope and save a pointer to the swing object
			this.swing = new Swing(game, this.swingPlacements[i][0], this.swingPlacements[i][1], 'swing', this.swingPlatform);
			this.swingPlatform.saveSwingPointer(this.swing);
			
			//add the swing to the game world
			game.add.existing(this.swing);
			game.add.existing(this.swingPlatform);
			
			//add objects to respective groups
			this.swings.add(this.swing);
			this.platforms.add(this.swingPlatform);
		}

		//2D array of platform parameters, each array contains [x, y, direction, limitA, limitB]
		this.platformParameters = [[game.width*1+32*27+16,32*5,"vertical",32*4,32*7],
		[game.width*1+32*15,32*11,"horizontal",game.width*1+32*15,game.width*1+32*29],
		[game.width*2+32*3,32*11,"horizontal",game.width*2+32*2,game.width*2+32*11],
		[game.width*2+32*18+16,32*6,"vertical",32*6,32*12],[game.width*3+32*5,32*14,"vertical",32*11,32*14],
		[game.width*3+32*21+16,32*9,"vertical",32*9,32*12],[game.width*4+32*16,32*10,"vertical",32*10,32*13],];
		
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
		
		//create the sound objects
		//add.audio(key, volume, loop)
		this.lavaTheme = game.add.audio('lava', 0.5, true);
		
		//play lava theme
		game.sound.stopAll();
		this.lavaTheme.play();
	},
	update: function()
	{
		//handle collision
		handleCollision(this.player, this.ball, this.boxes, this.platforms, this.ground);
		
		updateCamera(this.player, game, this.ball);
		
		//*****TAKE OUT LATER*****
		//switch states when player presses Q
		if(Q.justPressed())
		{
			this.lavaTheme.stop();
			game.state.start('Cutscene4');
		}
	},
}