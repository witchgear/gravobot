var Level2 = function(game){};
Level2.prototype =
{
	preload: function()
	{
		//note: if we have a seperate atlas add it here and change parameters in create accordingly
		
		//load audio assets
		game.load.path = 'assets/music/';
		game.load.audio('forest', ['forest.mp3', 'forest.ogg']);
	},
	create: function()
	{
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
		//this.boxPlacements = [game.width * 3 + 32 * 6, game.width * 5 +32 * 6,game.width*6+32*4,game.width*7+32*10,game.width*8+32*5]
		
		//create boxes
		/* uncomment when there are new box placements
		for(var i = 0; i < this.boxPlacements.length; i++)
		{
			//create a box using prefab
			this.box = new GravityBox(game, this.boxPlacements[i], 0, 'tutorial_atlas', 'box');
						//add the box to the game world and to the group
			game.add.existing(this.box);
			this.boxes.add(this.box);
		}
		*/

		//note: the order of this code matters, the swing group must be created before the
		//		platforms group or the platform sprite will be behind the swing rope
		this.swings = game.add.group()
		this.platforms = game.add.group();
		
		//2d array of coordinates for the top of the swing rope, each array contains [x, y]
		this.swingPlacements = [[500, 75]];
		
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
		/* uncomment when there are new platform placements
		//2D array of platform parameters, each array contains [x, y, direction, limitA, limitB]
		this.platformParameters = [[game.width * 4 + 32 * 8, 32*11, "horizontal",game.width * 4 + 32 * 8,game.width * 4 + 32 *16], 
		[game.width*4+32*22+16, 32*14, "vertical", 32*10,32*14],[game.width*5+32*20+16,32*14,"vertical",32*8,32*14],
		[game.width*8+32*18,32*13,"horizontal",game.width*8+32*11,game.width*8+32*18],[game.width*8+32*25+16,32*12,"vertical",32*8,32*12],
		[game.width*8+32*25+16,32*14,"vertical",32*10,32*14]];
		
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
		*/
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
		game.sound.stopAll();
		this.forestTheme.play();
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
			this.forestTheme.stop();
			game.state.start('Cutscene3');
		}
	},
}