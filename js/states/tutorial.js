var Tutorial = function(game){};
Tutorial.prototype =
{
	preload: function()
	{
		createLoadingScreen();
		
		//set load path and load assets
		game.load.path = 'assets/img/sprites/';
		game.load.atlas('tutorial_atlas', 'atlas.png', 'atlas.json') ;
		game.load.image('radius', 'radius.png');
		game.load.image('swing', 'temp_swing.png');
    
		//load audio assets
		game.load.path = 'assets/music/';
		game.load.audio('tutorial', ['tutorial.mp3', 'tutorial.ogg']);
		
		game.load.path = 'assets/sfx/';
		game.load.audio('jump', ['jump.mp3', 'jump.ogg']);
		game.load.audio('deploy', ['deploy.mp3', 'deploy.ogg']);
		game.load.audio('activate', ['activate.mp3', 'activate.ogg']);
		game.load.audio('return', ['return.mp3', 'return.ogg']);
		
		// load spritesheet and tilemap for terrain
		game.load.path = 'assets/img/terrain/';
		game.load.spritesheet('tutorialtiles', 'tutorialtiles.png', 32, 32) ;
		game.load.spritesheet('instructiles', 'instructiles.png', 32, 32);
		game.load.tilemap('map', 'tutorial_map.json', null, Phaser.Tilemap.TILED_JSON);
	},
	create: function()
	{
		// add tileset from json file
		this.terrain = game.add.tilemap('map') ;

		// add image for the tileset
		this.terrain.addTilesetImage('tutorial_tiles', 'tutorialtiles') ;
		this.terrain.addTilesetImage('instruct_tiles', 'instructiles');
		
		// create layers
		this.terrain.createLayer('Sky') ; // sky layer
		this.terrain.createLayer('Scenery') ; // scenery layer 1
		this.terrain.createLayer('Scenery2') ; // scenery layer 2
		this.terrain.createLayer('Scenery3') ; // scenery layer 3
		this.bg = this.terrain.createLayer('Background') ; // background layer
		this.bg.resizeWorld() ; // resize the world so it's the size of the background

		this.bgobj = this.terrain.createLayer('Background Objects') ; // background objects layer
		this.ground = this.terrain.createLayer('Ground') ; // ground layer

		// set collision for the ground tiles on the ground layer
		// tilemap.setCollision([tiles], collide (boolean), layer)
		this.terrain.setCollision([16, 28, 61, 62, 63, 73, 74, 75, 85, 86, 87], true, 'Ground') ;

		// set tile bias to 64 so collision is handled better
		game.physics.arcade.TILE_BIAS = 64 ;

		//create player object using prefab
		this.player = new Player(game, game.width/4, game.height *3/4, 'tutorial_atlas', 'idle0001'); 
		
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
		
		//array of gravity box x coordinates
		this.boxPlacements = [game.width * 3 + 32 * 11, game.width * 5 +32 * 6,game.width*6+32*4,game.width*7+32*10,game.width*8+32*5]
		
		//create boxes
		for(var i = 0; i < this.boxPlacements.length; i++)
		{
			//create a box using prefab
			this.box = new GravityBox(game, this.boxPlacements[i], 0, 'tutorial_atlas', 'box');
		
			//add the box to the game world and to the group
			game.add.existing(this.box);
			this.boxes.add(this.box);
		}

		// button that will end the tutorial
		this.button = game.add.sprite(game.width*8+32*25+16,32*8, 'tutorial_atlas', 'button');
		this.button.anchor.x = this.button.anchor.y = 0.5 ;
		this.button.position.x = game.width*8+32*25+16 ;
		this.button.position.y = 32*8 ;
		game.physics.arcade.enable(this.button);
		
		//create group for sliding platforms
		this.platforms = game.add.group();
		
		//2D array of platform parameters, each array contains [x, y, direction, limitA, limitB]
		this.platformParameters = [[game.width * 4 + 32 * 8, 32*11, "horizontal",game.width * 4 + 32 * 8,game.width * 4 + 32 *16], 
		[game.width*4+32*22+16, 32*14, "vertical", 32*10,32*14],[game.width*5+32*20+16,32*14,"vertical",32*8,32*14],[game.width*7+32*2 + 16,32*15,"vertical",32*12,32*14],
		[game.width*8+32*18,32*13,"horizontal",game.width*8+32*11,game.width*8+32*18],[game.width*8+32*25+16,32*12,"vertical",32*8,32*12]];
		
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
		
		//create sound objects
		//add.audio(key, volume, loop)
		this.tutorialTheme = game.add.audio('tutorial', 0.4, true);
		jumpSFX = game.add.audio('jump', 0.7, false);
		deploySFX = game.add.audio('deploy', 0.7, false);
		activateSFX = game.add.audio('activate', 0.7, false);
		returnSFX = game.add.audio('return', 0.7, false);
		
		//play tutorial
		game.sound.stopAll();
		this.tutorialTheme.play();

		this.over = false ;
	},
	update: function()
	{
		//handle collision
		handleCollision(this.player, this.ball, this.boxes, this.platforms, this.ground);
		
		updateCamera(this.player, game, this.ball);

		var tutorialOver = game.physics.arcade.overlap(this.platforms, this.button);
		
		//switch states when player presses Q
		if(tutorialOver)
		{
			if(!this.over)
			{
				this.over = true ;
				activateSFX.play(false) ;
			}
			//activateSFX.play(false) ;
			this.camera.fade(500, "#000000") ;
			this.tutorialTheme.fadeOut(100); //stop playing
			game.time.events.add(Phaser.Timer.SECOND * 0.5, startCutscene, this, 2);
		}
	}
}

//function that handles the necessary collision for each state
var handleCollision = function(player, ball, boxes, platforms, ground)
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

startCutscene = function(cutscene)
{
	c = 'Cutscene' + cutscene ;
	game.state.start(c);
}