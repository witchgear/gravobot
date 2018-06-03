var Cutscene4 = function(game){};
Cutscene4.prototype =
{
	preload: function()
	{
		game.load.path = 'assets/json/';
		game.load.json('cutscene_3', 'cutscene_3.json');

		game.load.path = 'assets/sfx/';
		game.load.audio('queentalk', 'queentalk.wav') ;

		game.load.path = 'assets/font/';
		game.load.bitmapFont('dialogueText','font.png','font.fnt');

		game.load.path = 'assets/img/sprites/'
		game.load.image('dialogueBox', 'dialoguebox.png') ;

		game.load.path = 'assets/img/cutscene/'
		game.load.image('bg', 'cutscene1bg.png') ;
		game.load.image('queen', 'queen.png') ;
		game.load.image('empress', 'empress.png') ;
		game.load.image('gravobot', 'bot.png') ;
		game.load.image('repaired', 'repaired.png') ;
	},
	create: function()
	{
		game.stage.backgroundColor = "#000000"; //background is black


		repaired = game.add.sprite(0, 0, 'repaired') ;

		bg = game.add.sprite(0, 0, 'bg') ;

		queen = game.add.sprite(game.width, game.height, 'queen') ;
		gravobot = game.add.sprite(game.width, game.height, 'gravobot') ;
		empress = game.add.sprite(game.width * 2, game.height, 'empress') ;
		empress.anchor.x = 0.5 ;

		var textFile = game.cache.getJSON('cutscene_3');

		this.voiceBlip = game.add.audio('queentalk', 0.3, true);

		this.dialogueBox = game.add.sprite(0, (game.height * 3/4), 'dialogueBox') ;

		this.dialogue = new Dialogue(game, textFile, 16, game.height * 3/4 + 3, 'dialogueText', this.voiceBlip, bg, this.dialogueBox, queen, gravobot, empress) ;

		game.add.existing(this.dialogue) ;
	},
	update: function()
	{
		//*****TAKE OUT LATER*****
		//switch states when player presses Q
		if(Q.justPressed() || this.dialogue.finished)
		{
			game.state.start('Title');
		}
	},
}