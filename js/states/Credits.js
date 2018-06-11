var Credits = function(game){};
Credits.prototype =
{
	preload: function()
	{
		createLoadingScreen();
		
		game.load.path = 'assets/json/';
		game.load.json('cutscene_3', 'cutscene_3.json');

		game.load.path = 'assets/font/';
		game.load.bitmapFont('dialogueText','font.png','font.fnt');

		game.load.path = 'assets/img/cutscene/'
		game.load.image('thankyou', 'thankyou.png') ;
	},
	create: function()
	{
		this.theme = game.add.sound('title', 0.4, true);
		this.theme.play();
		
		game.stage.backgroundColor = "#000000"; //background is black

		this.credits = game.add.bitmapText(game.width/2, game.height/2, 'menutext',
			'CREDITS\n\n\nTEAM DUCK SLAP IS:\n\nHana Cho - Programming, Music\nGigi Bachtel - Art, Programming, Writing\nRuth Schoenberg - Level Design/Implementation\n\nFont: VCR OSD Mono by Riciery Leal', 32);

		this.credits.anchor.x = 0.5 ;
		this.credits.anchor.y = 0.5 ;
		this.credits.position.x = game.width/2 ;
		this.credits.position.y = game.height/2 ;

		this.thankyou = game.add.sprite(0, 0, 'thankyou') ;
		this.thankyou.alpha = 0 ;

		this.game.input.mouse.capture = true ; // allow for mouse input

		this.mouseClicks = 0 ;
	},
	update: function()
	{
		if(this.game.input.activePointer.justPressed(30))
		{
			this.mouseClicks++ ;
		}

		if(this.mouseClicks == 1){
			game.add.tween(this.thankyou).to({ alpha: 1}, 100, Phaser.Easing.Linear.Out, true) ;
		}
		else if(this.thankyou.alpha == 1 && this.game.input.activePointer.justPressed(30))
		{
			this.theme.stop();
			game.state.start('Title');
		}
	},
}