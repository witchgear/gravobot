var Tutorial = function(game){};
Tutorial.prototype =
{
	preload: function()
	{
		//***TEMP UNTIL ATLAS***
		//set load path and load assets
		game.load.path = 'assets/img/sprites/';
		//game.load.spritesheet('idle', 'idle.png', 49, 64);
		//game.load.image('ball', 'gravityball.png');
		//game.load.image('box', 'box.png');
		game.load.atlas('tutorial_atlas', 'tutorial_atlas.png', 'tutorial_atlas.json')

		// load spritesheet and tilemap for terrain
		game.load.path = 'assets/img/terrain/';
		game.load.spritesheet('tutorialtiles', 'tutorialtiles.png', 32, 32) ;
		game.load.tilemap('map', 'tutorial_map.json', null, Phaser.Tilemap.TILED_JSON);
	},
	create: function()
	{
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
		
		//create player object using prefab
		this.player = new Player(game, 200, 100, 'tutorial_atlas', 'idle0001'); 
		
		//add player animations
		this.player.animations.add('idle', Phaser.Animation.generateFrameNames('idle', 1, 4, '', 4), 10, true);
		this.player.animations.add('walk', Phaser.Animation.generateFrameNames('walk', 1, 4, '', 4), 10, true);
		this.player.animations.play('idle');

		//camera = new Camera(game, player, 0, 0) ;
		
		//create gravity ball object using prefab
		this.ball = new GravityBall(game, this.player, 'tutorial_atlas', 'gravityball');
		
		//create group for gravity boxes
		this.boxes = game.add.group();
		this.boxes.enableBody = true;
		
		//create a box using prefab
		this.box = new GravityBox(game, 800, 100, 'tutorial_atlas', 'box');
		
		//create gravity influece object using prefab
		this.influence = new GravityInfluence(game, this.ball, this.player, this.boxes);
		
		//place the player after the ball so they're always at the front of the screen
		game.add.existing(this.ball);
		game.add.existing(this.influence);
		game.add.existing(this.box);
		game.add.existing(this.player);
		
		//add box to group here because it wont get added if its not onscreen
		this.boxes.add(this.box);
	},
	update: function()
	{
		//handle collision
		game.physics.arcade.collide(this.ground, this.player);
		game.physics.arcade.collide(this.ground, this.boxes);
		game.physics.arcade.collide(this.player, this.boxes);
		game.physics.arcade.collide(this.ball, this.boxes);
		updateCamera(this.player, game, this.ball) ;

		//*****TAKE OUT LATER*****
		//switch states when player presses s
		if(S.justPressed())
		{
			game.state.start('Cutscene');
		}
	},
	render: function()
	{
		//game.debug.body(this.player);
		//game.debug.body(this.influence);
		//game.debug.body(this.ball);
		//game.debug.body(this.box);
		//game.debug.body(this.ground) ;
	}
}