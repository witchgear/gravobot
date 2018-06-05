var disruptedWaterfalls = [] ;
var Level2 = function(game){};
Level2.prototype =
{
	preload: function()
	{
		//note: if we have a seperate atlas add it here and change parameters in create accordingly
		
		// load json assets
		game.load.path = 'assets/json/';
		game.load.json('waterfall_placement', 'waterfall_placement.json');

		//set load path and load assets
		game.load.path = 'assets/img/sprites/';
		game.load.atlas('tutorial_atlas', 'tutorial_atlas.png', 'tutorial_atlas.json') ;
		game.load.image('radius', 'radius.png');
		game.load.image('waterfall', 'waterfall.png');
    
		//load audio assets
		game.load.path = 'assets/music/';
		game.load.audio('forest', ['forest.mp3', 'forest.ogg']);

		// load spritesheet and tilemap for terrain
		game.load.path = 'assets/img/terrain/';
		game.load.spritesheet('level2_tiles', 'level2tiles.png', 32, 32) ;
		game.load.tilemap('map', 'level2_map.json', null, Phaser.Tilemap.TILED_JSON);

		//load audio assets
		game.load.path = 'assets/music/';
		game.load.audio('forest', ['forest.mp3', 'forest.ogg']);
	},
	create: function()
	{
		// add tileset from json file
		this.terrain = game.add.tilemap('map') ;

		// add image for the tileset
		this.terrain.addTilesetImage('level2tiles', 'level2_tiles');
		
		// create layers
		this.bg = this.terrain.createLayer('Background') ; // background layer
		this.bg.resizeWorld() ; // resize the world so it's the size of the background

		this.bgobj = this.terrain.createLayer('Background Objects') ; // background objects layer
		this.ground = this.terrain.createLayer('Ground') ; // ground layer
		this.water = this.terrain.createLayer('Water (temp)'); //water layer, probably temporary
		this.rails = this.terrain.createLayer('Rails');
		//this.falls = this.terrain.createLayer('Waterfalls');
		this.tree1 = this.terrain.createLayer('Treez');
		this.tree2 = this.terrain.createLayer('Treez2');
		// set collision for the ground tiles on the ground layer
		// tilemap.setCollision([tiles], collide (boolean), layer)
		this.terrain.setCollision([1,2,3,17,18,19,49,50,51], true, 'Ground') ;

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
		this.boxPlacements = [game.width*0+32*22,game.width*1+32*11,game.width*2+32*13,game.width*3+32*6,game.width*7+32*12];
		
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
		this.swingPlacements = [[game.width*5+32*9,32*-1],[game.width*5+32*18,0],[game.width*5+32*25,32*-1],
		[game.width*7+32*8,0],[game.width*7+32*21,32*-2],[game.width*8+32*16,0]];
		
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
		this.platformParameters = [[game.width*2+32*2+16,32*14,"vertical",32*10,32*13],
		[game.width*4+32*12,32*10+16,"horizontal",game.width*4+32*7,game.width*4+32*22],
		[game.width*4+32*12,32*4+16,"horizontal",game.width*4+32*7,game.width*4+32*22],
		[game.width*6+32*10,32*10,"horizontal",game.width*6+32*10,game.width*6+32*19],
		[game.width*6+32*10,32*6,"horizontal",game.width*6+32*10,game.width*6+32*19],
		[game.width*6+32*10,32*2,"horizontal",game.width*6+32*10,game.width*6+32*19],
		[game.width*6+32*22+16,32*15,"vertical",32*10,32*14],[game.width*6+32*25+16,32*9,"vertical",32*9,32*14],
		[game.width*6+32*25+16,32*7,"vertical",32*0,32*6],[game.width*8+32*8+16,32*7,"vertical",32*0,32*7],
		[game.width*8+32*8+16,32*9,"vertical",32*9,32*18]];
		
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

		// load JSON file with waterfall placements
		this.wfp = game.cache.getJSON('waterfall_placement');

		this.waterfalls = game.add.group() ;

		for(i = 0 ; i < this.wfp.waterfalls.length ; i++) {
			x = this.wfp.waterfalls[i].x * 32 ;
			y = this.wfp.waterfalls[i].y * 32 ;
			length = this.wfp.waterfalls[i].length ;
			//createWaterfall = function(game, key, x, y, length, group)
			createWaterfall(game, 'waterfall', x, y, length, this.waterfalls) ;
		}		

		//create gravity influece object using prefab
		this.influence = new GravityInfluence(game, 'radius', this.ball, this.boxes, this.platforms);
		
		//place the player after the ball so they're always at the front of the screen
		game.add.existing(this.ball);
		game.add.existing(this.influence);
		game.add.existing(this.player);
		
		//create the sound objects
		//add.audio(key, volume, loop)
		this.forestTheme = game.add.audio('forest', 0.4, true);
		
		//play forest theme
		this.forestTheme.play();
	},
	update: function()
	{
		//handle collision
		handleCollision(this.player, this.ball, this.boxes, this.platforms, this.ground);
		
		updateCamera(this.player, game, this.ball);

		game.physics.arcade.overlap(this.waterfalls, this.boxes, disruptWaterfall);
		game.physics.arcade.overlap(this.waterfalls, this.platforms, disruptWaterfall);
		game.physics.arcade.overlap(this.waterfalls, this.player, killGravobot);
		
		//*****TAKE OUT LATER*****
		//switch states when player presses Q
		if(Q.justPressed())
		{
			this.forestTheme.stop();
			game.state.start('Cutscene3');
		}
	},
}