var Cutscene2 = function(game){};
Cutscene2.prototype =
{
	preload: function()
	{
		createLoadingScreen();
		
		game.load.path = 'assets/json/';
		game.load.json('cutscene_1', 'cutscene_1.json');

		game.load.path = 'assets/sfx/';

		game.load.path = 'assets/font/';
		game.load.bitmapFont('dialogueText','font.png','font.fnt');

		game.load.path = 'assets/img/sprites/'
		game.load.image('dialogueBox', 'dialoguebox.png') ;

		game.load.path = 'assets/img/cutscene/'
		game.load.image('blackbox', 'blackbox.png');
		game.load.image('bg', 'cutscene2bg.png') ;
		game.load.image('queen', 'phonequeen.png') ;
		game.load.image('gravobot', 'bot.png') ;
		game.load.image('shattered', 'broken.png') ;
	},
	create: function()
	{
		game.stage.backgroundColor = "#000000"; //background is black

		bg = game.add.sprite(0, 0, 'bg') ;

		shattered = game.add.sprite(0, 0, 'shattered') ;
		shattered.alpha = 0 ;

		queen = game.add.sprite(game.width, game.height, 'queen') ;
		gravobot = game.add.sprite(game.width, game.height, 'gravobot') ;

		bb = game.add.sprite(0, 0, 'blackbox') ;
		bb.scale.x = bb.scale.y = 8;
		bb.alpha = 0 ;

		var textFile = game.cache.getJSON('cutscene_1');

		this.queenVoice = game.add.audio('queenVoice', 0.3, true);
		this.empressVoice = game.add.audio('empressVoice', 0.3, true);
		
		this.dialogueBox = game.add.sprite(0, (game.height * 3/4), 'dialogueBox') ;

		this.dialogue = new Dialogue(game, textFile, 16, game.height * 3/4 + 3, 'dialogueText', this.queenVoice, 
									 this.empressVoice, shattered, this.dialogueBox, queen, gravobot, null, bb) ;

		game.add.existing(this.dialogue) ;
	},
	update: function()
	{
		//*****TAKE OUT LATER*****
		//switch states when player presses Q
		if(Q.justPressed() || this.dialogue.finished)
		{
			game.sound.stopAll();
			game.state.start('Level2');
		}
	},
}