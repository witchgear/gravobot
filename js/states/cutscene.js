var Cutscene1 = function(game){};
Cutscene1.prototype =
{
	preload: function()
	{
		createLoadingScreen();
		
		game.load.path = 'assets/json/';
		game.load.json('cutscene_0', 'cutscene_0.json');

		game.load.path = 'assets/sfx/';
		game.load.audio('queenVoice', ['queen_voice.mp3', 'queen_voice.ogg']);
		game.load.audio('empressVoice', ['empress_voice.mp3', 'empress_voice.ogg']);

		game.load.path = 'assets/font/';
		game.load.bitmapFont('dialogueText','font.png','font.fnt');

		game.load.path = 'assets/img/sprites/'
		game.load.image('dialogueBox', 'dialoguebox.png') ;

		game.load.path = 'assets/img/cutscene/'
		game.load.image('bg', 'cutscene1bg.png') ;
		game.load.image('queen', 'queen.png') ;
		game.load.image('gravobot', 'bot.png') ;
	},
	create: function()
	{
		game.stage.backgroundColor = "#000000"; //background is black

		bg = game.add.sprite(0, 0, 'bg') ;
		bg.alpha = 0 ;

		queen = game.add.sprite(game.width, game.height, 'queen') ;
		gravobot = game.add.sprite(game.width, game.height, 'gravobot') ;

		var textFile = game.cache.getJSON('cutscene_0');

		this.queenVoice = game.add.audio('queenVoice', 0.3, true);
		this.empressVoice = game.add.audio('empressVoice', 0.3, true);

		this.dialogueBox = game.add.sprite(0, (game.height * 3/4), 'dialogueBox') ;

		this.dialogue = new Dialogue(game, textFile, 16, game.height * 3/4 + 3, 'dialogueText', this.queenVoice, 
									 this.empressVoice, bg, this.dialogueBox, queen, gravobot, null);

		game.add.existing(this.dialogue) ;
	},
	update: function()
	{
		//*****TAKE OUT LATER*****
		//switch states when player presses Q
		if(Q.justPressed() || this.dialogue.finished)
		{
			game.sound.stopAll();
			game.state.start('Tutorial');
		}
	},
}